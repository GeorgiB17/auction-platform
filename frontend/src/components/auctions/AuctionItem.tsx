import { FaClock, FaStar } from "react-icons/fa6";
import type { AuctionListItem } from "../../types/auction";
import { getTimeLeft } from "../../utils/time";
import { useNowContext } from "../../context/NowContext";

export interface AuctionItemProps {
  item: AuctionListItem;
  favorited?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
}

function AuctionItem({ item, favorited = false, onToggleFavorite }: AuctionItemProps) {

  const now = useNowContext();
  const timeLeft = getTimeLeft(item.endAt, now);

  return (
    <article className="group overflow-hidden rounded-[28px] bg-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          src={`http://localhost:3000${item.image}`}
          alt={item.title}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <span className="absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-slate-950/85 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-black/10">
          <FaClock />
          {timeLeft}
        </span>
        <span className={`absolute top-4 left-4 inline-flex items-center justify-center rounded-full bg-white/90 p-2 text-sm shadow-lg cursor-pointer transition ${favorited ? "text-amber-400" : "text-slate-300"}`} onClick={onToggleFavorite}>
          <FaStar />
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 line-clamp-2">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {item.bids} bids · current top offer
          </p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Current bid
            </p>
            <p className="mt-1 text-2xl font-semibold text-green-600">
              ${item.currentPrice}
            </p>
          </div>
          <span className="rounded-full bg-hdm-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-carmine inline-flex items-center justify-center">
            Place bid
          </span>
        </div>
      </div>
    </article>
  );
}

export default AuctionItem;