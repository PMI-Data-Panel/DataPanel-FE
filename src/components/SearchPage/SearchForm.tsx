import { Search } from "lucide-react";
import { useEffect } from "react";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const SearchForm = ({
  searchQuery,
  setSearchQuery,
  onSearch,
  isSearching,
}: SearchFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleSubmit(e as any);
    }
  };

  // 이미 키워드가 있다면 (히스토리로 넘어온 경우) 검색바에 query 입력해두기
  useEffect(() => {
    setSearchQuery(searchQuery);
  }, [searchQuery, setSearchQuery]);

  return (
    <form onSubmit={handleSubmit} className="w-2/3 mx-auto">
      <div className="relative w-full">
        <input
          className="w-full px-4 py-3 pr-16 text-black border-2 border-gray-200 rounded-2xl text-md transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="술담배 좋아하는 30대"
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 rounded-xl p-2 cursor-pointer hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Search className="text-white w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
