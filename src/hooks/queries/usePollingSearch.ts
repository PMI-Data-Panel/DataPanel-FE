import { useQuery } from "@tanstack/react-query";
import { useSearch } from "../useSearch";
import type { ResponseSearchPullingDto } from "../../types/search";
import { getSearchQueryResult } from "../../apis/search";

const POLLING_INTERVAL = 2_000; // 2초

function usePollingSearch() {
  const { task_id } = useSearch();

  return useQuery<ResponseSearchPullingDto, Error>({
    queryKey: ["searchStatus", task_id],
    queryFn: () => {
      return getSearchQueryResult(task_id);
    },

    // 폴링 로직
    enabled: !!task_id,

    // refetchInterval: 조건부 폴링
    refetchInterval: (query) => {
      const data = query.state.data;
      const status = data?.state;

      // 작업 완료 시 폴링 중단
      if (status === "SUCCESS" || status === "FAILURE") {
        return false;
      }
      // 그 외 상태(PENDING 등)일 경우 계속 폴링
      return POLLING_INTERVAL;
    },

    // 폴링이 될때까지 staleTime을 무한으로 설정
    staleTime: Infinity,
    gcTime: 10 * 60 * 1_000, // 10분
  });
}

export default usePollingSearch;
