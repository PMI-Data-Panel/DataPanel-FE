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
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between">
        {/* 결과 정보 */}
        <div className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">
            {startItem.toLocaleString()}
          </span>
          {" - "}
          <span className="font-medium text-gray-900">
            {endItem.toLocaleString()}
          </span>
          {" / "}
          <span className="text-gray-600">{totalHits.toLocaleString()}개</span>
        </div>

        {/* 페이지네이션 버튼 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">이전</span>
          </button>

          {/* 현재 페이지 표시 */}
          <div className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium">
            {currentPage} / {totalPages > 0 ? totalPages : 1}
          </div>

          <button
            onClick={handleNext}
            disabled={!hasMore || isLoading}
            className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
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

