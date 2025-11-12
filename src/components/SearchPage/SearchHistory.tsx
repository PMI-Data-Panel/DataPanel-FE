import { useNavigate } from "react-router-dom";
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

  const handleHistoryDeleteClick = () => {
    removeSearchHistory(data.id);
  };

  return (
    <div className="flex justify-between items-center">
      <li
        key={data.id}
        className="text-sm text-gray-700 whitespace-nowrap hover:text-blue-600 cursor-pointer"
        onClick={handleHistoryClick}
      >
        {query}
      </li>
      <button
        className="text-gray-300 hover:text-gray-600 cursor-pointer"
        onClick={handleHistoryDeleteClick}
      >
        x
      </button>
    </div>
  );
};

export default SearchHistory;
