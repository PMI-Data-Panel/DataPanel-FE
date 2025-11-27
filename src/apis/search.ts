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
  const { data } = await axiosInstance.post("/search/nl", body);
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
  return data;
};

// (GET) /search/opensearch/{user_id}
export const getUserDetail = async (
  userId: string
): Promise<ResponseUserDetailDto> => {
  const { data } = await axiosInstance.get(`/search/opensearch/${userId}`);
  return data;
};

// (POST) /search/refine/query
export const postLLMRequery = async (
  body: RequestLLMRequeryDto
): Promise<ResponseLLMRequeryDto> => {
  const baseURL = import.meta.env.VITE_SERVER_API_URL;
  const endpoint = "/search/refine/query";
  const fullURL = `${baseURL}${endpoint}`;
  
  try {
    const { data } = await axiosInstance.post(endpoint, body);
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
