import { useQuery } from "@tanstack/react-query";
import { getVisualization } from "../../apis/search";
import { QUERY_KEY } from "../../constants/key";

function useGetVisualization() {
  return useQuery({
    queryKey: [QUERY_KEY.allData],
    queryFn: () => getVisualization(),
    staleTime: 10 * 60 * 1_000, // 10분
    gcTime: 30 * 60 * 1_000, // 30분
  });
}

export default useGetVisualization;
