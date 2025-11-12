import { createContext } from "react";

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  resultCount?: number;
}

interface SearchContextType {
  query: string;
  task_id: string;
  status_url: string;
  searchHistory: SearchHistoryItem[];
  setQuery: (query: string) => Promise<void>;
  setTaskId: (task_id: string) => Promise<void>;
  addSearchHistory: (query: string, resultCount?: number) => void;
  removeSearchHistory: (id: string) => void;
  clearSearchHistory: () => void;
}

export const SearchContext = createContext<SearchContextType>({
  query: "",
  task_id: "",
  status_url: "",
  searchHistory: [],
  setQuery: async () => {},
  setTaskId: async () => {},
  addSearchHistory: () => {},
  removeSearchHistory: () => {},
  clearSearchHistory: () => {},
});
