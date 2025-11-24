import type {
  RequestSearchNlDto,
  ResponseSearchNlDto,
  ResponseVisualization,
  ResponseUserDetailDto,
  RequestLLMRequeryDto,
  ResponseLLMRequeryDto,
  AllStatisticsResponse,
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

// (GET) /visualization/qa/all-statistics
export const getAllStatistics = async (): Promise<AllStatisticsResponse> => {
  const { data } = await axiosInstance.get("/visualization/qa/all-statistics");
  console.log("📥 전체 통계 데이터:", JSON.stringify(data, null, 2));
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
    console.log("📥 사용자 소스 데이터:", JSON.stringify(data.hits.hits[0]._source, null, 2));
    console.log("📥 사용자 메타데이터:", JSON.stringify(data.hits.hits[0]._source.metadata, null, 2));
    console.log("📥 사용자 QA 페어 개수:", data.hits.hits[0]._source.qa_pairs?.length || 0);
  }
  return data;
};

// (POST) /search/refine/query
export const postLLMRequery = async (
  body: RequestLLMRequeryDto
): Promise<ResponseLLMRequeryDto> => {
  const baseURL = import.meta.env.VITE_SERVER_API_URL;
  const endpoint = "/search/refine/query";
  const fullURL = `${baseURL}${endpoint}`;
  
  console.log("📤 LLM 재질의 API 요청 URL:", fullURL);
  console.log("📤 LLM 재질의 API 요청 Body:", JSON.stringify(body, null, 2));
  
  try {
    const { data } = await axiosInstance.post(endpoint, body);
    console.log("📥 LLM 재질의 API 응답 받음");
    console.log("📥 응답:", data);
    return data;
  } catch (error: unknown) {
    console.error("❌ LLM 재질의 API 호출 실패:");
    console.error("❌ 요청 URL:", fullURL);
    console.error("❌ 요청 Body:", JSON.stringify(body, null, 2));
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown; status?: number }; message?: string };
      console.error("❌ 에러 상세:", axiosError.response?.data || axiosError.message);
      console.error("❌ 상태 코드:", axiosError.response?.status);
    } else if (error instanceof Error) {
      console.error("❌ 에러 메시지:", error.message);
    } else {
      console.error("❌ 알 수 없는 에러:", error);
    }
    
    throw error;
  }
};
