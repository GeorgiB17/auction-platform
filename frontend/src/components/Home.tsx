import { useAuth } from "./AuthProvider";
import AuctionItem from "./auctions/AuctionItem";
import { Navigate } from "react-router-dom";
import { AuctionListItem } from "../types/auction";
import { useNavigate } from "react-router-dom";
import Pagination from "./Pagination";
import { useState, useEffect } from "react";

export default function Home() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<AuctionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 3;

  const totalPages = Math.max(1, Math.ceil(auctions.length / itemsPerPage));

  const pageStart =
    auctions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;

  const pageEnd = Math.min(auctions.length, currentPage * itemsPerPage);
  
  const currentPageAuctions = auctions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const toggleFavorite = async (auctionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(
        `http://localhost:3000/favorites/${auctionId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      
      if (!response.ok) throw new Error("Failed to toggle favorite");
      
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(auctionId)) {
          newSet.delete(auctionId);
        } else {
          newSet.add(auctionId);
        }
        return newSet;
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const auctionsPromise = fetch("http://localhost:3000/auctions", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      });

    const favoritesPromise = fetch("http://localhost:3000/favorites", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((favorites) => {
        return new Set((favorites || []).map((fav: any) => fav.auction_id));
      })
      .catch(() => new Set());

    Promise.all([auctionsPromise, favoritesPromise])
      .then(([loadedAuctions, favoriteSet]) => {
        setAuctions(loadedAuctions);
        setFavoriteIds(favoriteSet);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    setCurrentPage(1);
  }, [auctions]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading auctions...
      </div>
    );
  }

  const categories = ["Electronics", "Clothing", "Vehicles", "Other"];

  return (
    <>
      <section className="space-y-6">
        {/* PAGINATION TOP */}
        <Pagination
          title="Live Auctions"
          pageStart={pageStart}
          pageEnd={pageEnd}
          totalItems={auctions.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        />

        {/* AUCTIONS */}
        <div className="grid gap-4">
          {currentPageAuctions.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/auctiondetails/${item.id}`)}
              className="text-left"
            >
              <AuctionItem 
                item={item} 
                favorited={favoriteIds.has(item.id)}
                onToggleFavorite={(e) => toggleFavorite(item.id, e)}
              />
            </button>
          ))}
        </div>
      </section>


      <aside className="sticky top-6 min-h-[calc(100vh-48px)] h-fit bg-white rounded-3xl p-6 border">
        <h2 className="font-bold">Filters</h2>

        <div className="mt-4 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className="w-full text-left px-4 py-3 border rounded-2xl"
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}