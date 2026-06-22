import { useEffect, useRef } from "react";
import { socket } from "../socket/socket";

export default function FavoriteWatcher() {
  const joinedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;

    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:3000/favorites", {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;

        const auctionIds = Array.isArray(data) ? data.map((f: any) => f.auction_id || f.auction?.id) : [];

        auctionIds.forEach((id: string) => {
          if (!id) return;
          if (!joinedRef.current.has(id)) {
            socket.emit("joinAuction", id);
            joinedRef.current.add(id);
          }
        });
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };

    fetchFavorites();

    const handleFavoriteToggled = (data: { auctionId: string; favorited: boolean }) => {
      const { auctionId, favorited } = data;
      if (!auctionId) return;

      if (favorited) {
        if (!joinedRef.current.has(auctionId)) {
          socket.emit("joinAuction", auctionId);
          joinedRef.current.add(auctionId);
        }
      } else {
        if (joinedRef.current.has(auctionId)) {
          socket.emit("leaveAuction", auctionId);
          joinedRef.current.delete(auctionId);
        }
      }
    };

    socket.on("favoriteToggled", handleFavoriteToggled);

    // refresh favorites every 60s to pick up changes from other devices
    const iv = setInterval(fetchFavorites, 60000);

    return () => {
      mounted = false;
      clearInterval(iv);
      socket.off("favoriteToggled", handleFavoriteToggled);
      // leave joined auctions
      joinedRef.current.forEach((id) => socket.emit("leaveAuction", id));
      joinedRef.current.clear();
    };
  }, []);

  return null;
}
