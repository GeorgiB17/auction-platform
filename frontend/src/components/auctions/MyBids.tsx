import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { FiArrowRight } from "react-icons/fi";
import Pagination from "../Pagination";

type BidItem = {
  id: string;
  amount: number;
  createdAt: string;
  auctionId: string;
  auctionTitle: string;
  auctionImage: string | null;
  auctionCurrentPrice: number;
};

export default function MyBids() {
  const { user, loading: authLoading } = useAuth();
  const [bids, setBids] = useState<BidItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const itemsPerPage = 3;
  const totalPages = Math.max(1, Math.ceil(bids.length / itemsPerPage));
  const pageStart = bids.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const pageEnd = Math.min(bids.length, currentPage * itemsPerPage);
  const currentPageBids = bids.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    fetch("http://localhost:3000/user/bids", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Unable to fetch your bids");
        }
        return response.json();
      })
      .then((data) => {
        setBids(data.bids ?? []);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load your bids. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [bids]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading your session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading your bids...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] bg-white p-8 shadow-xl border">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
              My bids
            </p>
            <h1 className="text-3xl font-bold text-slate-950">Your offers</h1>
            <p className="mt-2 text-sm text-slate-500">
              All bids placed by your account are shown here.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-700">
            {bids.length} bid{bids.length === 1 ? "" : "s"}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {error}
        </div>
      ) : null}

      {bids.length === 0 ? (
        <div className="rounded-[32px] bg-white p-10 shadow-xl border text-slate-600">
          <h2 className="text-xl font-semibold text-slate-900">
            No bids yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Place your first bid on an auction to see it here.
          </p>
        </div>
      ) : (
        <>
          <Pagination
            title="Your bids"
            pageStart={pageStart}
            pageEnd={pageEnd}
            totalItems={bids.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setCurrentPage((page) => Math.max(page - 1, 1))}
            onNext={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
          />

          <div className="grid gap-6">
            {currentPageBids.map((bid) => (
            <article
              key={bid.id}
              className="group overflow-hidden rounded-[28px] bg-white shadow-xl border transition duration-300 hover:-translate-y-1"
              onClick={() => navigate(`/auctiondetails/${bid.auctionId}`)}
            >
              <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                <div className="relative overflow-hidden bg-slate-100">
                  {bid.auctionImage ? (
                    <img
                      src={`http://localhost:3000${bid.auctionImage}`}
                      alt={bid.auctionTitle}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      No image available
                    </div>
                  )}
                </div>
                   
                <div className="p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-slate-950">
                        {bid.auctionTitle}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Bid placed on {new Date(bid.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                          Your bid amount
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-green-600">
                          ${bid.amount.toFixed(2)}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-slate-50 p-5">
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                          Current auction price
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-slate-900">
                          ${bid.auctionCurrentPrice.toFixed(2)}
                        </p>
                      </div>
                      
                    </div>
                    
                  </div>
                 <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">
                    
                    </span>
                    <span className="inline-flex items-center gap-2 text-hdm-red font-semibold whitespace-nowrap">
                      View auction <FiArrowRight />
                    </span>
                  </div>
                  
                </div>
              </div>
            </article>
          ))}
        </div>
      </>
      )}
    </div>
  );
}
