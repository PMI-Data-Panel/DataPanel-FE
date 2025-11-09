import { createContext } from "react";

interface SearchContextType {
  query: string;
  task_id: string;
  status_url: string;
  setQuery: (query: string) => Promise<void>;
  setTaskId: (task_id: string) => Promise<void>;
}

export const SearchContext = createContext<SearchContextType>({
  query: "",
  task_id: "",
  status_url: "",
  setQuery: async () => {},
  setTaskId: async () => {},
});
