import { useMutation } from "@tanstack/react-query";
import type { RequestSearchRefineDto } from "../../types/search";
import { postSearchRefine } from "../../apis/search";

function usePostSearchRefine() {
  return useMutation({
    mutationFn: (body: RequestSearchRefineDto) => postSearchRefine(body),
    onSuccess: () => {
      console.log("재질의 api 쿼리: ");
    },
    onError: () => {
      console.log("재질의 과정에서 오류 발생");
    },
  });
}

export default usePostSearchRefine;
