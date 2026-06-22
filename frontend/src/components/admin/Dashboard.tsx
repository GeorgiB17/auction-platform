import { useAuth } from "../AuthProvider";
import { Navigate } from "react-router-dom";
import { useState, SubmitEvent, ChangeEvent } from "react";
import { FaImage, FaTag } from "react-icons/fa";

export default function Dashboard() {
	const { user } = useAuth();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  let imageFileCountLabel = "Choose image files";
  if (imageFiles.length > 0) {
    imageFileCountLabel = `${imageFiles.length} file${imageFiles.length === 1 ? "" : "s"} selected`;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageFiles(Array.from(event.target.files ?? []));
  };


  if (!user) {
    return <Navigate to="/login" replace />;
  }

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
    setIsSubmitting(true);
		setStatusMessage("");

		const form = e.currentTarget;
		const formData = new FormData(form);

		// Convert checkbox value properly
    const hide = formData.get("hide") === "on";
    formData.set("hide", hide.toString());

    imageFiles.forEach((file) => formData.append("auctionImages", file));

    console.log([...formData.entries()]);
		try {
			const response = await fetch("http://localhost:3000/admin/create-auction", {
				method: "POST",
				credentials: "include",
				body: formData, // Send FormData directly (no Content-Type header needed)
			});

      const result = await response.json();
			if (!response.ok || !result.success) {
				setStatusMessage(result.message || "Failed to create auction");
			}
      setStatusMessage("Auction created successfully!");
			form.reset();
      setImageFiles([]);
		} catch (error) {
			console.error(error);
      setStatusMessage("Failed to create auction");
		} finally {
      setIsSubmitting(false);
    }
	}


  return (
    <main className="max-w-6xl px-4 sm:px-6 lg:px-8">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-hdm-red">
              Admin portal
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              Create a new auction
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              Enter auction details and upload images.
            </p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="auction-title" className="block">
                Auction title
              </label>
              <input
                id="auction-title"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
                placeholder="Enter auction title"
                type="text"
                name="auctionTitle"
                required
              />
            </div>
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="starting-price" className="block">
                Starting price
              </label>
              <input
                id="starting-price"
                type="number"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
                placeholder="0"
                name="startingPrice"
                required
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="end-date" className="block">
                End date
              </label>
              <input
                id="end-date"
                type="datetime-local"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
                name="endDate"
                required
              />
            </div>
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="auction-image" className="mb-2 block">
                Upload images
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-slate-500 transition hover:border-hdm-red/30 hover:bg-slate-100">
                <FaImage className="h-5 w-5 text-hdm-red" />
                <span className="text-sm">{imageFileCountLabel}</span>
                <input
                  id="auction-image"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 text-sm font-semibold text-slate-700">
              <label htmlFor="year-purchased" className="block">
                Year purchased
              </label>
              <input
                id="year-purchased"
                type="number"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
                placeholder="2024"
                name="yearPurchased"
              />
            </div>
            <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700">
              <input
                id="hide-auction"
                type="checkbox"
                className="h-5 w-5 rounded border-slate-300 text-hdm-red focus:ring-hdm-red"
                name="hideAuction"
              />
              <label htmlFor="hide-auction" className="text-sm font-semibold">
                Hide auction from public
              </label>
            </div>
          </div>

          <div className="space-y-2 text-sm font-semibold text-slate-700">
            <label htmlFor="auction-description" className="block">
              Auction description
            </label>
            <textarea
              id="auction-description"
              rows={4}
              className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-hdm-red focus:ring-2 focus:ring-hdm-red/10"
              placeholder="Write a description for the auction"
              name="auctionDescription"
            />
          </div>

          {statusMessage && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-md text-slate-700">
              {statusMessage}
            </div>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-hdm-red px-7 py-3 text-sm font-semibold text-white transition hover:bg-carmine disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaTag />
              {isSubmitting ? "Creating…" : "Create auction"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}