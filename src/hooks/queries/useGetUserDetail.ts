import { useQuery } from "@tanstack/react-query";
import { getUserDetail } from "../../apis/search";
import { QUERY_KEY } from "../../constants/key";

function useGetUserDetail(userId: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.userDetail, userId],
    queryFn: () => getUserDetail(userId!),
    enabled: !!userId, // userId가 있을 때만 요청
    staleTime: 5 * 60 * 1_000, // 5분
    gcTime: 10 * 60 * 1_000, // 10분
  });
}

export default useGetUserDetail;

