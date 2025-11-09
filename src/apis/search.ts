import type {
  RequestSearchDto,
  ResponseSearchDto,
  ResponseSearchPullingDto,
} from "../types/search";
import { axiosInstance } from "./axios";

// 검색어 비동기 전송 함수
export const postSearchQuery = async (
  body: RequestSearchDto
): Promise<ResponseSearchDto> => {
  try {
    //const { data } = await axiosInstance.post("/search/nl-async", body);
    const { data } = await axiosInstance.post(
      "http://127.0.0.1:3658/m1/1121784-1113177-default/search/nl-async",
      body
    );
    return data;
  } catch (error) {
    console.log("검색어 post 중 오류 발생: ", error);
    throw error;
  }
};

// 검색 결과 가져오는 함수 (가져올때까지 풀링해줘야 함)
export const getSearchQueryResult = async (
  task_id: string
): Promise<ResponseSearchPullingDto> => {
  try {
    /*  const { data } = await axiosInstance.get(`/search/status/${task_id}`, {
      params: { task_id },
    }); */
    const { data } = await axiosInstance.get(
      "http://127.0.0.1:3658/m1/1121784-1113177-default/search/status/1",
      {
        params: { task_id },
      }
    );
    return data;
  } catch (error) {
    console.log("검색 결과 get 중 오류 발생: ", error);
    throw error;
  }
};
