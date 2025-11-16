import { createContext } from "react";

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
}

interface SearchContextType {
  query: string;
  searchHistory: SearchHistoryItem[];
  setQuery: (query: string) => Promise<void>;
  addSearchHistory: (query: string, resultCount?: number) => void;
  removeSearchHistory: (id: string) => void;
  clearSearchHistory: () => void;
}

export const SearchContext = createContext<SearchContextType>({
  query: "",
  searchHistory: [],
  setQuery: async () => {},
  addSearchHistory: () => {},
  removeSearchHistory: () => {},
  clearSearchHistory: () => {},
});
