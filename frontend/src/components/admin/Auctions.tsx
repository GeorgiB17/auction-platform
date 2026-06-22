import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaSpinner, FaTrash } from "react-icons/fa";
import type { AdminAuction } from "../../types/auction";
import { FaUpRightFromSquare } from "react-icons/fa6";

export function Auctions() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState<AdminAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadAuctions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/admin/auctions", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }

      const data = await response.json();
      setAuctions(data);
    } catch (fetchError) {
      console.error("Error fetching auctions:", fetchError);
      setError("Failed to load auctions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuctions();
  }, []);

  const handleDelete = async (auctionId: string) => {
    const confirmed = window.confirm("Delete this auction?");

    if (!confirmed) {
      return;
    }

    setDeletingId(auctionId);

    try {
      const response = await fetch(`http://localhost:3000/admin/delete-auction/${auctionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete auction");
      }

      setAuctions((currentAuctions) =>
        currentAuctions.map((auction) =>
          auction.id === auctionId ? { ...auction, isDeleted: true } : auction,
        ),
      );
    } catch (deleteError) {
      console.error("Error deleting auction:", deleteError);
      setError("Failed to delete auction.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (value: number) => `$${value}`;

  return (
    <main className="max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-hdm-red">
              Admin portal
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              Auctions
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              Review every auction, mark one as deleted, or jump into editing.
            </p>
          </div>
          <button
            type="button"
            onClick={loadAuctions}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-hdm-red hover:text-hdm-red"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-slate-600">
            <FaSpinner className="h-5 w-5 animate-spin text-hdm-red" />
            Loading auctions…
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : auctions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-slate-500">
            No auctions found.
          </div>
        ) : (
          <div className="grid gap-4">
            {auctions.map((auction) => {
              const coverImage = auction.images[0]?.url;

              return (
                <article
                  key={auction.id}
                  className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex flex-1 gap-4">
                      <div className="h-24 w-24 overflow-hidden rounded-3xl border border-slate-200 bg-white">
                        {coverImage ? (
                          <img
                            src={`http://localhost:3000${coverImage}`}
                            alt={auction.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-semibold text-slate-950">
                            {auction.title}
                          </h2>
                          {auction.isDeleted && (
                            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                              Deleted
                            </span>
                          )}
                          {auction.isHidden && (
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                              Hidden
                            </span>
                          )}
                        </div>

                        <p className="line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
                          {auction.description || "No description provided."}
                        </p>

                        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                          <p><span className="font-semibold text-slate-900">Start:</span> {formatCurrency(auction.startPrice)}</p>
                          <p><span className="font-semibold text-slate-900">Current:</span> {formatCurrency(auction.currentPrice)}</p>
                          <p><span className="font-semibold text-slate-900">Year:</span> {auction.yearPurchased}</p>
                          <p><span className="font-semibold text-slate-900">Owner:</span> {auction.createdBy ?? "Unknown"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row gap-3 lg:flex-col lg:items-stretch">
                      <button
                        type="button"
                        onClick={() => navigate(`/auctiondetails/${auction.id}`)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-hdm-red hover:text-hdm-red"
                      >
                        <FaUpRightFromSquare />
                        Show
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/auctions/${auction.id}/edit`)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-hdm-red hover:text-hdm-red"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(auction.id)}
                        disabled={deletingId === auction.id}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-hdm-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-carmine disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <FaTrash />
                        {deletingId === auction.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}