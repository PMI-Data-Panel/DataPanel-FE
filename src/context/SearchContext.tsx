import { createContext } from "react";
import type { ResponseSearchNlDto } from "../types/search";

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
}

interface SearchContextType {
  query: string;
  searchHistory: SearchHistoryItem[];
  searchResults: ResponseSearchNlDto | null;
  setQuery: (query: string) => Promise<void>;
  setSearchResults: (data: ResponseSearchNlDto | null) => void;
  addSearchHistory: (query: string, resultCount?: number) => void;
  removeSearchHistory: (id: string) => void;
  clearSearchHistory: () => void;
}

export const SearchContext = createContext<SearchContextType>({
  query: "",
  searchHistory: [],
  searchResults: null,
  setQuery: async () => {},
  setSearchResults: () => {},
  addSearchHistory: () => {},
  removeSearchHistory: () => {},
  clearSearchHistory: () => {},
});
