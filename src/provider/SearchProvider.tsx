import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import { SearchContext } from "../context/SearchContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const SearchProvider = ({ children }: PropsWithChildren) => {
  const queryStorage = useLocalStorage(LOCAL_STORAGE_KEY.searchQuery);
  const [query, setQueryState] = useState<string>("");
  const [taskId, setTaskIdState] = useState<string>("");
  const [statusUrl] = useState<string>("");

  // 초기 로드 시 localStorage에서 값 가져오기
  useEffect(() => {
    const savedQuery = queryStorage.getItem();
    if (savedQuery) {
      setQueryState(savedQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setQuery = async (newQuery: string) => {
    setQueryState(newQuery);
    queryStorage.setItem(newQuery);
  };

  const setTaskId = async (newTaskId: string) => {
    setTaskIdState(newTaskId);
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        task_id: taskId,
        status_url: statusUrl,
        setQuery,
        setTaskId,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
