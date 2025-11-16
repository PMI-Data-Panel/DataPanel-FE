import type { BarData } from "../types/graph";
import type { ResponseSearchPullingDto } from "../types/search";

// 성별 분포 데이터 계산
export const calculateGenderData = (
  data: ResponseSearchPullingDto | undefined
): BarData[] => {
  if (!data?.result?.results) return [];

  const genderCount: Record<string, number> = {};
  const totalCount = data.result.results.length;

  data.result.results.forEach((result) => {
    const gender = result.demographic_info.gender;
    if (gender === null || gender === undefined || gender === "") {
      genderCount["알 수 없음"] = (genderCount["알 수 없음"] || 0) + 1;
    } else {
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    }
  });

  const colorMap: Record<string, string> = {
    여성: "#ec4899",
    남성: "#3b82f6",
    "알 수 없음": "#9ca3af",
  };

  return Object.entries(genderCount)
    .map(([label, count]) => ({
      label,
      count,
      value: Math.round((count / totalCount) * 100),
      color: colorMap[label] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count);
};

// 연령대 분포 데이터 계산
export const calculateAgeData = (
  data: ResponseSearchPullingDto | undefined
): BarData[] => {
  if (!data?.result?.results) return [];

  const ageCount: Record<string, number> = {};
  const totalCount = data.result.results.length;

  data.result.results.forEach((result) => {
    const ageGroup = result.demographic_info.age_group;
    if (ageGroup === null || ageGroup === undefined || ageGroup === "") {
      ageCount["알 수 없음"] = (ageCount["알 수 없음"] || 0) + 1;
    } else {
      ageCount[ageGroup] = (ageCount[ageGroup] || 0) + 1;
    }
  });

  const colorMap: Record<string, string> = {
    "20대": "#60a5fa",
    "30대": "#14b8a6",
    "40대": "#f97316",
    "50대": "#ec4899",
    "50대+": "#a855f7",
    "60대 이상": "#8b5cf6",
    "알 수 없음": "#9ca3af",
  };

  const ageOrder = [
    "20대",
    "30대",
    "40대",
    "50대",
    "50대+",
    "60대 이상",
    "알 수 없음",
  ];

  return Object.entries(ageCount)
    .map(([label, count]) => ({
      label,
      count,
      value: Math.round((count / totalCount) * 100),
      color: colorMap[label] || "#6b7280",
    }))
    .sort((a, b) => {
      const indexA = ageOrder.indexOf(a.label);
      const indexB = ageOrder.indexOf(b.label);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
};

// 지역 분포 데이터 계산
export const calculateRegionData = (
  data: ResponseSearchPullingDto | undefined
): BarData[] => {
  if (!data?.result?.results) return [];

  const regionCount: Record<string, number> = {};
  const totalCount = data.result.results.length;

  data.result.results.forEach((result) => {
    const region = result.demographic_info.region;
    if (region === null || region === undefined || region === "") {
      regionCount["알 수 없음"] = (regionCount["알 수 없음"] || 0) + 1;
    } else {
      regionCount[region] = (regionCount[region] || 0) + 1;
    }
  });

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  return Object.entries(regionCount)
    .map(([label, count], index) => ({
      label,
      count,
      value: Math.round((count / totalCount) * 100),
      color: label === "알 수 없음" ? "#9ca3af" : colors[index % colors.length],
    }))
    .sort((a, b) => b.count - a.count);
};

// 거주지 분포 데이터 계산 (sub_region - 상위 10개)
export const calculateResidenceData = (
  data: ResponseSearchPullingDto | undefined
): BarData[] => {
  if (!data?.result?.results) return [];

  const residenceCount: Record<string, number> = {};
  const totalCount = data.result.results.length;

  data.result.results.forEach((result) => {
    const subRegion = result.demographic_info.sub_region;
    if (subRegion === null || subRegion === undefined || subRegion === "") {
      residenceCount["알 수 없음"] = (residenceCount["알 수 없음"] || 0) + 1;
    } else {
      residenceCount[subRegion] = (residenceCount[subRegion] || 0) + 1;
    }
  });

  const colors = [
    "#60a5fa",
    "#14b8a6",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
    "#10b981",
    "#f97316",
    "#06b6d4",
    "#a855f7",
    "#84cc16",
  ];

  return Object.entries(residenceCount)
    .map(([label, count], index) => ({
      label,
      count,
      value: Math.round((count / totalCount) * 100),
      color: label === "알 수 없음" ? "#9ca3af" : colors[index % colors.length],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // 상위 10개만
};

// 설문지 출처 분포 데이터 계산 (panel)
export const calculatePanelSourceData = (
  data: ResponseSearchPullingDto | undefined
): BarData[] => {
  if (!data?.result?.results) return [];

  const panelCount: Record<string, number> = {};
  const totalCount = data.result.results.length;

  data.result.results.forEach((result) => {
    const panel = result.demographic_info.panel;
    if (panel === null || panel === undefined || panel === "") {
      panelCount["알 수 없음"] = (panelCount["알 수 없음"] || 0) + 1;
    } else {
      panelCount[panel] = (panelCount[panel] || 0) + 1;
    }
  });

  const colorMap: Record<string, string> = {
    KT: "#3b82f6",
    "U+": "#10b981",
    SKT: "#f59e0b",
    LG: "#ec4899",
    "알 수 없음": "#9ca3af",
  };

  return Object.entries(panelCount)
    .map(([label, count]) => ({
      label,
      count,
      value: Math.round((count / totalCount) * 100),
      color: colorMap[label] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count);
};

// null 값이 있는지 확인용
export const checkHasNullValues = (
  data: ResponseSearchPullingDto | undefined
): boolean => {
  if (!data?.result?.results) return false;
  return data.result.results.some(
    (result) =>
      result.demographic_info.gender === null ||
      result.demographic_info.age_group === null ||
      result.demographic_info.region === null ||
      result.demographic_info.sub_region === null ||
      result.demographic_info.panel === null
  );
};
