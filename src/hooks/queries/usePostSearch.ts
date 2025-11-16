import { useMutation } from "@tanstack/react-query";
import { postSearchNl } from "../../apis/search";
import type { RequestSearchNlDto } from "../../types/search";

function usePostSearch() {
  return useMutation({
    mutationFn: (body: RequestSearchNlDto) => postSearchNl(body),

    onSuccess: () => {
      console.log("🟠 검색 요청 성공");
    },

    onError: (error) => {
      console.log("🟠 검색 요청 중 에러 발생:", error);
    },
  });
}

export default usePostSearch;
