import { useMutation } from "@tanstack/react-query";
import { postSearchNl } from "../../apis/search";
import type { RequestSearchNlDto } from "../../types/search";

function usePostSearch() {
  return useMutation({
    mutationFn: (body: RequestSearchNlDto) => postSearchNl(body),

    onSuccess: () => {},

    onError: () => {},
  });
}

export default usePostSearch;
