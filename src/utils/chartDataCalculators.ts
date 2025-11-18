import type { Distribution, ResponseSearchNlDto } from "../types/search";

// 성별 분포 데이터 계산
export const calculateGenderData = (
  data: ResponseSearchNlDto | null
): Distribution[] => {
  if (!data?.results || data.results.length === 0) return [];

  const genderCount: Record<string, number> = {};
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    const gender = result.demographic_info.gender;
    if (gender === null || gender === undefined || gender === "") {
      genderCount["알 수 없음"] = (genderCount["알 수 없음"] || 0) + 1;
    } else {
      genderCount[gender] = (genderCount[gender] || 0) + 1;
    }
  });

  return Object.entries(genderCount)
    .map(([label, count]) => ({
      label,
      value: count,
      percentage: Number(((count / totalCount) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);
};

// 연령대 분포 데이터 계산
export const calculateAgeData = (
  data: ResponseSearchNlDto | null
): Distribution[] => {
  if (!data?.results || data.results.length === 0) return [];

  const ageCount: Record<string, number> = {};
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    const ageGroup = result.demographic_info.age_group;
    if (ageGroup === null || ageGroup === undefined || ageGroup === "") {
      ageCount["알 수 없음"] = (ageCount["알 수 없음"] || 0) + 1;
    } else {
      ageCount[ageGroup] = (ageCount[ageGroup] || 0) + 1;
    }
  });

  const ageOrder = [
    "10대",
    "20대",
    "30대",
    "40대",
    "50대",
    "60대",
    "70대",
    "80대",
    "90대",
    "100대",
    "알 수 없음",
  ];

  return Object.entries(ageCount)
    .map(([label, count]) => ({
      label,
      value: count,
      percentage: Number(((count / totalCount) * 100).toFixed(2)),
    }))
    .sort((a, b) => {
      const indexA = ageOrder.indexOf(a.label);
      const indexB = ageOrder.indexOf(b.label);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
};

// 지역 분포 데이터 계산
export const calculateRegionData = (
  data: ResponseSearchNlDto | null
): Distribution[] => {
  if (!data?.results || data.results.length === 0) return [];

  const regionCount: Record<string, number> = {};
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    const region = result.demographic_info.region;
    if (region === null || region === undefined || region === "") {
      regionCount["알 수 없음"] = (regionCount["알 수 없음"] || 0) + 1;
    } else {
      regionCount[region] = (regionCount[region] || 0) + 1;
    }
  });

  return Object.entries(regionCount)
    .map(([label, count]) => ({
      label,
      value: count,
      percentage: Number(((count / totalCount) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);
};

// 거주지 분포 데이터 계산 (sub_region - 상위 10개)
export const calculateResidenceData = (
  data: ResponseSearchNlDto | null
): Distribution[] => {
  if (!data?.results || data.results.length === 0) return [];

  const residenceCount: Record<string, number> = {};
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    const subRegion = result.demographic_info.sub_region;
    if (subRegion === null || subRegion === undefined || subRegion === "") {
      residenceCount["알 수 없음"] = (residenceCount["알 수 없음"] || 0) + 1;
    } else {
      residenceCount[subRegion] = (residenceCount[subRegion] || 0) + 1;
    }
  });

  return Object.entries(residenceCount)
    .map(([label, count]) => ({
      label,
      value: count,
      percentage: Number(((count / totalCount) * 100).toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // 상위 10개만
};

// null 값이 있는지 확인용
export const checkHasNullValues = (
  data: ResponseSearchNlDto | null
): boolean => {
  if (!data?.results || data.results.length === 0) return false;
  return data.results.some(
    (result) =>
      result.demographic_info.gender === null ||
      result.demographic_info.gender === "" ||
      result.demographic_info.age_group === null ||
      result.demographic_info.age_group === "" ||
      result.demographic_info.region === null ||
      result.demographic_info.region === "" ||
      result.demographic_info.sub_region === null ||
      result.demographic_info.sub_region === ""
  );
};
