import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSearchQuery } from "../../apis/search";
import type { RequestSearchDto } from "../../types/search";
import { useSearch } from "../useSearch";

function usePostSearch() {
  const qc = useQueryClient();
  const { setTaskId } = useSearch();

  return useMutation({
    mutationFn: (body: RequestSearchDto) => postSearchQuery(body),

    // 백엔드 api 개발이 완료되지 않아 임시로 주석 처리
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["searchStatus"] }); // 원래 있던 searchStatus 캐시 무효화

      // 백엔드쪽 api 개발 안돼서 일단 주석처리 해둠
      /*  if (data && data.task_id) {
        setTaskId(data.task_id);
      } else {
        console.log("task id를 못받았습니다.");
        setTaskId("");
      } */

      // 임시로 task_id를 고정값으로 설정
      setTaskId("temporary_task_id_12345");
      console.log("검색 요청 성공, 응답 데이터: ", data);
      console.log("임시 고정토큰 설정 완료: ", "temporary_task_id_12345");
    },
    onError: (error) => {
      console.log("검색 요청 중 에러 발생:", error);
      setTaskId("");
    },
  });
}

export default usePostSearch;
