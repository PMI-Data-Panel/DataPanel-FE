import type { RequestSearchNlDto, ResponseSearchNlDto } from "../types/search";
import { axiosInstance } from "./axios";

// (POST) /search/nl
export const postSearchNl = async (
  body: RequestSearchNlDto
): Promise<ResponseSearchNlDto> => {
  const { data } = await axiosInstance.post("/search/nl", body);
  return data;
};
