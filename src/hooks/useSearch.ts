import { useContext } from "react";
import { SearchContext } from "../context/SearchContext";

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("SearchContext를 찾을 수 없습니다.");
  }
  return context;
};
