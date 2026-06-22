import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaGavel, FaCalendarDay, FaStar, FaRegStar } from "react-icons/fa";
import { socket } from "../../socket/socket.ts";
import { getTimeLeft } from "../../utils/time.ts";
import { AuctionDetail } from "../../types/auction.ts";
import { useNowContext } from "../../context/NowContext";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

import "../../styles/lightbox.css";

export default function AuctionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const now = useNowContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [favorited, setFavorited] = useState(false);

  const totalBids = useMemo(
    () => Array.isArray(auction?.bids) 
      ? auction.bids.length 
      : (auction?.bids ?? 0),
    [auction],
  );

  const slides = useMemo(() => {
    return (
      auction?.images?.map((img) => ({
        src: `http://localhost:3000${img.url}`,
      })) || []
    );
  }, [auction]);

  useEffect(() => {
    if (!id) return;

    const fetchAuctionDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/auctions/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch auction details");
        }

        const data = await response.json();
        setAuction(data.auction);

        // fetch favorite status
        try {
          const favRes = await fetch(`http://localhost:3000/favorites/${id}`, { credentials: "include" });
          if (favRes.ok) {
            const favJson = await favRes.json();
            setFavorited(!!favJson.favorited);
          }
        } catch (err) {
          // ignore
        }

      } catch (error) {
        console.error("Error fetching auction:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionDetail();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    socket.emit("joinAuction", id);

    console.log(`Joined room auction:${id}`);

    return () => {
      socket.emit("leaveAuction", id);

      console.log(`Left room auction:${id}`);
    };
  }, [id]);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
    };

    const handleConnectError = (err: Error) => {
      console.error("Socket connect error:", err.message);
    };

    const handleAuctionUpdated = (updatedAuction: any) => {
      console.log("Auction updated:", updatedAuction);
      setAuction(updatedAuction);
    };
    
    const handleBidSuccess = (data: { message: string }) => {
      console.log(data.message);
      setBidAmount("");
      // auto-favorite the auction when user successfully places a bid
      (async () => {
        try {
          if (!auction) return;
          await fetch(`http://localhost:3000/favorites/${auction.id}`, {
            method: "POST",
            credentials: "include",
          });
          setFavorited(true);
          socket.emit("favoriteToggled", { auctionId: auction.id, favorited: true });
        } catch (err) {
          console.error("Failed to auto-favorite on bid:", err);
        }
      })();
    };

    const handleBidError = (data: { error?: string }) => {
      console.error(data.error || "Failed to place bid");
    };

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    socket.on("connect_error", handleConnectError);

    socket.on("auctionUpdated", handleAuctionUpdated);

    socket.on("bidSuccess", handleBidSuccess);

    socket.on("bidError", handleBidError);

    return () => {
      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);

      socket.off("connect_error", handleConnectError);

      socket.off("auctionUpdated", handleAuctionUpdated);

      socket.off("bidSuccess", handleBidSuccess);

      socket.off("bidError", handleBidError);
    };
  }, [id]);

  const handlePlaceBid = () => {
    if (!auction) return;

    if (!bidAmount) {
      console.warn("Please enter a bid amount");
      return;
    }

    socket.emit("placeBid", {
      auctionId: auction.id,
      amount: Number(bidAmount),
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl">
          <p className="text-lg font-semibold text-slate-900">
            Loading auction details…
          </p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl">
          <p className="text-lg font-semibold text-slate-900">
            Auction not found
          </p>
          <button
            className="mt-6 rounded-full bg-hdm-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-carmine"
            onClick={() => navigate("/")}
          >
            Back to auctions
          </button>
        </div>
      </div>
    );
  }

  const timeLeft = getTimeLeft(auction.end_at, now);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-hdm-red transition hover:text-carmine"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft className="h-4 w-4" />
              Back to auctions
            </button>
            <div className="mt-4 flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-slate-950 sm:text-4xl">
              {auction.title}
              </h1>
              <button
                aria-label="Toggle favorite"
                className="rounded-full p-2 hover:bg-slate-100"
                onClick={async () => {
                  try {
                    const res = await fetch(`http://localhost:3000/favorites/${auction.id}`, {
                      method: "POST",
                      credentials: "include",
                    });
                    if (res.ok) {
                      const json = await res.json();
                      const fav = !!json.favorited;
                      setFavorited(fav);
                      // notify other client-side listeners to join/leave rooms
                      socket.emit("favoriteToggled", { auctionId: auction.id, favorited: fav });
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                {favorited ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
              </button>
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
              {auction.description}
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-3xl bg-slate-950 px-6 py-5 text-white shadow-lg">
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-slate-300">
              <FaCalendarDay />
              Time left
            </div>
            <p className="text-3xl font-semibold">
              {timeLeft}
            </p>
            <p className="text-sm text-slate-300">
              {totalBids} bids · Top offer ${auction.current_price}
            </p>
          </div>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-xl">
            <img
              src={slides[activeIndex]?.src || ""}
              className="h-96 w-full cursor-pointer rounded-3xl object-cover"
              onClick={() => setLightboxIndex(activeIndex)}
            />
            {slides.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {slides.map((img, index) => (
                  <button
                    key={img.src}
                    onClick={() => setActiveIndex(index)}
                    className="overflow-hidden rounded-3xl border"
                  >
                    <img
                      src={img.src}
                      className="h-24 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Current bid
                </p>
                <p className="mt-2 text-3xl font-semibold text-hdm-red">
                  ${auction.current_price}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Total bids
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {totalBids}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-6 rounded-[30px] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-100">
                <FaGavel />
                Auction details
              </div>
            </div>

            <div className="space-y-4 rounded-3xl bg-slate-900/80 p-5">
              <label
                htmlFor="bid-amount"
                className="block text-sm font-semibold text-slate-200"
              >
                Your bid
              </label>
              <input
                id="bid-amount"
                type="number"
                inputMode="decimal"
                value={bidAmount}
                onChange={(event) => setBidAmount(event.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/90 px-4 py-3 text-white outline-none transition focus:border-hdm-red"
                placeholder="Enter bid amount"
              />
              <button
                type="button"
                onClick={handlePlaceBid}
                disabled={isPlacingBid}
                className="w-full rounded-2xl bg-hdm-red px-4 py-3 text-sm font-semibold text-white transition hover:bg-carmine disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPlacingBid ? "Placing bid…" : "Place bid now"}
              </button>
              {bidError && (
                <p className="mt-3 text-sm text-rose-300">{bidError}</p>
              )}
            </div>

            <div className="rounded-3xl bg-slate-900/80 p-5 text-sm text-slate-400">
              <p className="font-semibold text-slate-100">Auction summary</p>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center justify-between">
                  <span>Starting price</span>
                  <span className="text-slate-200">${auction.start_price}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Ends on</span>
                  <span className="text-slate-200">
                    {new Date(auction.end_at).toLocaleString()}
                  </span>
                </li>
              </ul>
            </div>
          </aside>
        </section>
      </section>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Thumbnails]}
      />
    </>
    
  );
}