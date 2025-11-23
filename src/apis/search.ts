import type {
  RequestSearchNlDto,
  RequestSearchRefineDto,
  ResponseSearchNlDto,
  ResponseSearchRefineDto,
  ResponseVisualization,
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

// (POST) /search/refine/query
export const postSearchRefine = async (
  body: RequestSearchRefineDto
): Promise<ResponseSearchRefineDto> => {
  const { data } = await axiosInstance.post("/search/refine/query", body);
  return data;
};
