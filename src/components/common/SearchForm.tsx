import { Search } from "lucide-react";

interface SearchFormProps {
  keyword?: string;
  setKeyword: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

const SearchForm = ({
  keyword,
  setKeyword,
  onSearch,
  isLoading,
}: SearchFormProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    keyword = e.target.value;
    console.log("SearchForm 키워드:", keyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="w-[85%] mx-auto">
      <div className="relative w-full">
        <input
          className="w-full px-4 py-3 pr-16 text-black border-2 border-gray-200 rounded-2xl text-md transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          type="text"
          value={keyword}
          onChange={handleOnChange}
          onKeyPress={handleKeyPress}
          required
          disabled={isLoading}
          placeholder={"전문직이고 미혼인 응답자"}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 rounded-xl p-2 cursor-pointer hover:bg-blue-600 transition-colors">
          <Search className="text-white w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
