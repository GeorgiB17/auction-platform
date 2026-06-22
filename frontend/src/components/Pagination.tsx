import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type PaginationProps = {
  title?: string;
  pageStart: number;
  pageEnd: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export default function Pagination({
  title = "Items",
  pageStart,
  pageEnd,
  totalItems,
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PaginationProps) {
  return (
    <div className="sticky top-6 z-10 bg-white p-4 rounded-3xl border flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-bold">{title}</h2>
        <p className="text-sm text-slate-500">
          Showing {pageStart}-{pageEnd} of {totalItems}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentPage === 1}
          className="px-3 py-2 border rounded-xl disabled:opacity-40 flex items-center gap-1"
        >
          <FiChevronLeft />
          Prev
        </button>

        <div className="px-3 py-2 border rounded-xl text-sm font-semibold">
          {currentPage} / {totalPages}
        </div>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className="px-3 py-2 border rounded-xl disabled:opacity-40 flex items-center gap-1"
        >
          Next
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
