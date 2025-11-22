import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalHits: number;
  hasMore: boolean;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const Pagination = ({
  currentPage,
  pageSize,
  totalHits,
  hasMore,
  onPageChange,
  isLoading = false,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalHits / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalHits);

  const handlePrevious = () => {
    if (currentPage > 1 && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasMore && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm p-5 md:p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 결과 정보 */}
        <div className="text-sm md:text-base text-[#8b95a1] bg-[#f5f6f8] px-4 py-2 rounded-xl">
          <span className="font-semibold text-[#191f28]">
            {startItem.toLocaleString()}
          </span>
          {" - "}
          <span className="font-semibold text-[#191f28]">
            {endItem.toLocaleString()}
          </span>
          {" / "}
          <span className="text-[#8b95a1]">{totalHits.toLocaleString()}개</span>
        </div>

        {/* 페이지네이션 버튼 */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[#191f28] hover:bg-[#f5f6f8] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전</span>
          </button>

          {/* 현재 페이지 표시 */}
          <div className="px-5 py-2.5 rounded-xl bg-[#3182f6] text-white font-semibold text-sm md:text-base min-w-[80px] text-center shadow-sm">
            {currentPage} / {totalPages > 0 ? totalPages : 1}
          </div>

          <button
            onClick={handleNext}
            disabled={!hasMore || isLoading}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[#191f28] hover:bg-[#f5f6f8] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <span className="hidden sm:inline">다음</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

