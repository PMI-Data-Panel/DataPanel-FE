import type { PropsWithChildren } from "react";
import { useState, useEffect } from "react";
import { SearchContext } from "../context/SearchContext";
import type { SearchHistoryItem } from "../context/SearchContext";
import type { ResponseSearchNlDto } from "../types/search";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const MAX_HISTORY_ITEMS = 20; // 최대 저장 개수

export const SearchProvider = ({ children }: PropsWithChildren) => {
  const queryStorage = useLocalStorage(LOCAL_STORAGE_KEY.searchQuery);
  const historyStorage = useLocalStorage(LOCAL_STORAGE_KEY.searchHistory);
  const sessionStorage = useLocalStorage(LOCAL_STORAGE_KEY.sessionId);

  const [query, setQueryState] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [searchResults, setSearchResults] =
    useState<ResponseSearchNlDto | null>(null);
  const [searchSessionId, setSearchSessionid] = useState<string>("");

  // 초기 로드 시 localStorage에서 값 가져오기
  useEffect(() => {
    const savedQuery = queryStorage.getItem();
    if (savedQuery) {
      setQueryState(savedQuery);
    }

    const savedHistory = historyStorage.getItem();
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setSearchHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSearchHistory([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setQuery = async (newQuery: string) => {
    setQueryState(newQuery);
    queryStorage.setItem(newQuery);
  };

  // 검색 내역 추가
  const addSearchHistory = (query: string, resultCount?: number) => {
    if (!query.trim()) return;

    const newItem: SearchHistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      query: query.trim(),
      timestamp: Date.now(),
      resultCount,
    };

    setSearchHistory((prev) => {
      // 중복 제거 (같은 쿼리가 있으면 제거)
      const filtered = prev.filter((item) => item.query !== query.trim());
      // 최신 항목을 맨 앞에 추가
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      // localStorage에 저장
      historyStorage.setItem(JSON.stringify(updated));

      return updated;
    });
  };

  // 세션 id 추가
  const addSearchSessionId = (sessionId: string) => {
    if (!sessionId) return;

    setSearchSessionid(sessionId);

    sessionStorage.setItem(sessionId);
  };

  // 검색 내역 삭제
  const removeSearchHistory = (id: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      historyStorage.setItem(JSON.stringify(updated));
      return updated;
    });
  };

  // 검색 내역 전체 삭제
  const clearSearchHistory = () => {
    setSearchHistory([]);
    historyStorage.removeItem();
  };

  return (
    <SearchContext.Provider
      value={{
        query,
        searchHistory,
        searchResults,
        searchSessionId,
        setQuery,
        setSearchResults,
        addSearchHistory,
        addSearchSessionId,
        removeSearchHistory,
        clearSearchHistory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
