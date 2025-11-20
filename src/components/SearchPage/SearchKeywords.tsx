import Button from "../common/Button";

interface SearchKeywordsProps {
  placeholder: string;
  setKeyword: () => void;
}

const SearchKeywords = ({ placeholder, setKeyword }: SearchKeywordsProps) => {
  return (
    <>
      <Button text={placeholder} size="sm" onClick={setKeyword} />
    </>
  );
};

export default SearchKeywords;
