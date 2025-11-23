import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import type { SearchHistoryItem } from "../../context/SearchContext";
import { useSearch } from "../../hooks/useSearch";

interface SearchHistoryProps {
  query: string;
  data: SearchHistoryItem;
}

const SearchHistory = ({ query, data }: SearchHistoryProps) => {
  const navigate = useNavigate();
  const { setQuery, removeSearchHistory } = useSearch();

  const handleHistoryClick = () => {
    navigate(`/search`);
    setQuery(query);
  };

  const handleHistoryDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    removeSearchHistory(data.id);
  };

  return (
    <li
      key={data.id}
      className="group flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-[#f5f6f8] transition-all duration-200 cursor-pointer"
      onClick={handleHistoryClick}
    >
      <span className="text-sm text-[#191f28] flex-1 min-w-0 truncate hover:text-[#3182f6] transition-colors">
        {query}
      </span>
      <button
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#e5e7eb] rounded-lg transition-all duration-200 shrink-0"
        onClick={handleHistoryDeleteClick}
        aria-label="삭제"
      >
        <X className="w-4 h-4 text-[#8b95a1] hover:text-[#ef4444]" />
      </button>
    </li>
  );
};

export default SearchHistory;
