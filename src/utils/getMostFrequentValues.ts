import type { BarData } from "../types/graph";

/**
 * 그래프 데이터에서 최빈값(가장 높은 퍼센테이지) 추출
 */
export const getMostFrequentValue = (data: BarData[]): BarData | null => {
  if (data.length === 0) return null;

  // value(퍼센테이지)가 가장 높은 항목 찾기
  return data.reduce(
    (max, current) => (current.value > max.value ? current : max),
    data[0]
  );
};

/**
 * 여러 그래프 데이터의 최빈값들을 객체로 반환
 */
export interface MostFrequentValues {
  gender: BarData | null;
  age: BarData | null;
  region: BarData | null;
  residence: BarData | null;
  panelSource: BarData | null;
}

export const getAllMostFrequentValues = (
  genderData: BarData[],
  ageData: BarData[],
  regionData: BarData[],
  residenceData: BarData[],
  panelSourceData: BarData[]
): MostFrequentValues => {
  return {
    gender: getMostFrequentValue(genderData),
    age: getMostFrequentValue(ageData),
    region: getMostFrequentValue(regionData),
    residence: getMostFrequentValue(residenceData),
    panelSource: getMostFrequentValue(panelSourceData),
  };
};
