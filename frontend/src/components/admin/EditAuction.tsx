import { useEffect, useState, SubmitEvent} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import type { AdminAuction } from "../../types/auction";

function toDatetimeLocalValue(value: string) {
  return value ? value.slice(0, 16) : "";
}

export default function EditAuction() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [auction, setAuction] = useState<AdminAuction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("Auction id is missing.");
      setLoading(false);
      return;
    }

    const loadAuction = async () => {
      try {
        const response = await fetch(`http://localhost:3000/admin/auctions/${id}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch auction");
        }

        const data = await response.json();
        setAuction(data.auction);
        console.log("Fetched auction:", data.auction);
        setIsHidden(data.auction.isHidden);
      } catch (fetchError) {
        console.error("Error fetching auction:", fetchError);
        setError("Failed to load auction.");
      } finally {
        setLoading(false);
      }
    };

    loadAuction();
  }, [id]);

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!id || !auction) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:3000/admin/auctions/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.get("title"),
          description: formData.get("description"),
          startingPrice: formData.get("startingPrice"),
          yearPurchased: formData.get("yearPurchased"),
          endAt: formData.get("endAt"),
          hide: formData.get("hide") === "on",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update auction");
      }

      navigate("/dashboard/auctions");
    } catch (saveError) {
      console.error("Error updating auction:", saveError);
      setError("Failed to save auction.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Loading auction…</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="rounded-3xl border border-slate-200 bg-white px-8 py-10 shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Auction not found</p>
          <button
            type="button"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-hdm-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-carmine"
            onClick={() => navigate("/dashboard/auctions")}
          >
            <FaArrowLeft />
            Back to auctions
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-5xl px-4 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-semibold text-hdm-red transition hover:text-carmine"
          onClick={() => navigate("/dashboard/auctions")}
        >
          <FaArrowLeft className="h-4 w-4" />
          Back to auctions
        </button>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-hdm-red">
            Edit auction
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">
            {auction.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
            Update the auction details and save the changes.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="title" className="block">
                Auction title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                defaultValue={auction.title}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
                required
              />
            </div>

            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="startingPrice" className="block">
                Starting price
              </label>
              <input
                id="startingPrice"
                name="startingPrice"
                type="number"
                step="0.01"
                defaultValue={auction.startPrice}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
                required
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="endAt" className="block">
                End date
              </label>
              <input
                id="endAt"
                name="endAt"
                type="datetime-local"
                defaultValue={toDatetimeLocalValue(auction.endAt)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
                required
              />
            </div>

            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="yearPurchased" className="block">
                Year purchased
              </label>
              <input
                id="yearPurchased"
                name="yearPurchased"
                type="number"
                defaultValue={auction.yearPurchased}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700">
            <input
              id="hide"
              type="checkbox"
              name="hide"
              checked={isHidden}
              onChange={(e) => setIsHidden(e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-hdm-red focus:ring-hdm-red"
            />
            <label htmlFor="hide" className="text-sm font-semibold">
              Hide auction from public
            </label>
          </div>

          <div className="space-y-2 text-sm font-semibold text-slate-700">
            <label htmlFor="description" className="block">
              Auction description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={auction.description}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 text-sm text-slate-500">
              <p>Current price: ${auction.currentPrice.toFixed(2)}</p>
              <p>Status: {auction.isDeleted ? "Deleted" : "Active"}</p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-hdm-red px-7 py-3 text-sm font-semibold text-white transition hover:bg-carmine disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaSave />
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}