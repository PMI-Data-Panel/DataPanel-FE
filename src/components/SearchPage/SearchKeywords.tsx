import Button from "../common/Button";

interface SearchKeywordsProps {
  placeholder: string;
  setKeyword: () => void;
  handleSearch: () => void;
}

const SearchKeywords = ({
  placeholder,
  setKeyword,
  handleSearch,
}: SearchKeywordsProps) => {
  return (
    <>
      <Button
        text={placeholder}
        size="sm"
        onClick={() => {
          setKeyword();
          handleSearch();
        }}
      />
    </>
  );
};

export default SearchKeywords;
