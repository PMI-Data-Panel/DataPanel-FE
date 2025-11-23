import type {
  RequestSearchNlDto,
  ResponseSearchNlDto,
  ResponseVisualization,
  ResponseUserDetailDto,
  RequestSearchRefineDto,
  ResponseSearchRefineDto,
} from "../types/search";
import { axiosInstance } from "./axios";

// (POST) /search/nl
export const postSearchNl = async (
  body: RequestSearchNlDto
): Promise<ResponseSearchNlDto> => {
  console.log("📤 API 요청 Body:", JSON.stringify(body, null, 2));
  console.log("📤 page_size 값:", body.page_size);
  console.log("📤 page_size 타입:", typeof body.page_size);
  console.log("📤 전체 body 객체:", body);

  const { data } = await axiosInstance.post("/search/nl", body);

  console.log("📥 API 응답 받음");
  console.log("📥 응답 page_size:", data.page_size);
  console.log("📥 응답 results 개수:", data.results?.length);
  console.log("📥 전체 응답:", data);

  return data;
};

// (GET) /visualization/user-info/survey_responses_merged
export const getVisualization = async (): Promise<ResponseVisualization> => {
  const { data } = await axiosInstance.get(
    "/visualization/user-info/survey_responses_merged"
  );
  return data;
};

// (POST) /search/refine/query
export const postSearchRefine = async (
  body: RequestSearchRefineDto
): Promise<ResponseSearchRefineDto> => {
  const { data } = await axiosInstance.post("/search/refine/query", body);
  return data;
};

// (GET) /search/opensearch/{user_id}
export const getUserDetail = async (
  userId: string
): Promise<ResponseUserDetailDto> => {
  console.log("📤 사용자 상세 정보 요청:", userId);
  const { data } = await axiosInstance.get(`/search/opensearch/${userId}`);
  console.log("📥 사용자 상세 정보 응답 받음");
  console.log("📥 전체 응답 데이터:", JSON.stringify(data, null, 2));
  if (data?.hits?.hits?.[0]?._source) {
    console.log(
      "📥 사용자 소스 데이터:",
      JSON.stringify(data.hits.hits[0]._source, null, 2)
    );
    console.log(
      "📥 사용자 메타데이터:",
      JSON.stringify(data.hits.hits[0]._source.metadata, null, 2)
    );
    console.log(
      "📥 사용자 QA 페어 개수:",
      data.hits.hits[0]._source.qa_pairs?.length || 0
    );
  }
  return data;
};
