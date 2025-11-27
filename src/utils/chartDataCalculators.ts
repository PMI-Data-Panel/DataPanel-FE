import type { Distribution, ResponseSearchNlDto } from "../types/search";

// 성별 분포 데이터 계산
export const calculateGenderData = (
  data: ResponseSearchNlDto | null
): Distribution[] => {
  if (!data?.results || data.results.length === 0) return [];

  const genderCount: Record<string, number> = {};
  const genderOrder: string[] = []; // 순서 보존용
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    const gender = result.demographic_info?.gender;
    const key = gender === null || gender === undefined || gender === ""
      ? "알 수 없음"
      : gender;

    if (genderCount[key] === undefined) {
      genderOrder.push(key); // 처음 나타난 순서 기록
    }
    genderCount[key] = (genderCount[key] || 0) + 1;
  });

  return genderOrder.map((label) => ({
    label,
    value: genderCount[label],
    percentage: Number(((genderCount[label] / totalCount) * 100).toFixed(2)),
  }));
};

// 연령대 분포 데이터 계산
export const calculateAgeData = (
  data: ResponseSearchNlDto | null
): Distribution[] => {
  if (!data?.results || data.results.length === 0) return [];

  const ageCount: Record<string, number> = {};
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    const ageGroup = result.demographic_info?.age_group;
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
  const regionOrder: string[] = []; // 순서 보존용
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    const region = result.demographic_info?.region;
    const key = region === null || region === undefined || region === ""
      ? "알 수 없음"
      : region;

    if (regionCount[key] === undefined) {
      regionOrder.push(key); // 처음 나타난 순서 기록
    }
    regionCount[key] = (regionCount[key] || 0) + 1;
  });

  return regionOrder.map((label) => ({
    label,
    value: regionCount[label],
    percentage: Number(((regionCount[label] / totalCount) * 100).toFixed(2)),
  }));
};

// 거주지 분포 데이터 계산 (sub_region - 상위 10개)
export const calculateResidenceData = (
  data: ResponseSearchNlDto | null
): Distribution[] => {
  if (!data?.results || data.results.length === 0) return [];

  const residenceCount: Record<string, number> = {};
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    const subRegion = result.demographic_info?.sub_region;
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

// 패널 분포 데이터 계산
export const calculatePanelData = (
  data: ResponseSearchNlDto | null
): Distribution[] => {
  if (!data?.results || data.results.length === 0) return [];

  const panelCount: Record<string, number> = {};
  const panelOrder: string[] = []; // 순서 보존용
  const totalCount = data.results.length;

  data.results.forEach((result) => {
    // 여러 가능한 경로에서 패널 정보 찾기
    const panel =
      result.panel ||
      result.metadata?.panel ||
      result.demographic_info?.panel ||
      result.panel_name ||
      result.panel_type;

    // 패널 정보 정규화 (대소문자 통일, 공백 제거)
    let key: string;
    if (panel === null || panel === undefined || panel === "") {
      key = "미정";
    } else {
      const normalized = String(panel).trim();
      // 빈 문자열 체크
      if (normalized === "") {
        key = "미정";
      } else {
        key = normalized;
      }
    }

    if (panelCount[key] === undefined) {
      panelOrder.push(key); // 처음 나타난 순서 기록
    }
    panelCount[key] = (panelCount[key] || 0) + 1;
  });

  // "미정"이 있으면 마지막으로 정렬
  const sortedOrder = panelOrder.filter(p => p !== "미정");
  if (panelOrder.includes("미정")) {
    sortedOrder.push("미정");
  }

  // 중복 제거 및 정렬 (값이 큰 순서대로)
  const uniqueData = sortedOrder.map((label) => ({
    label,
    value: panelCount[label],
    percentage: Number(((panelCount[label] / totalCount) * 100).toFixed(2)),
  }));

  // 값이 큰 순서대로 정렬 (미정은 마지막)
  return uniqueData.sort((a, b) => {
    if (a.label === "미정") return 1;
    if (b.label === "미정") return -1;
    return b.value - a.value;
  });
};

// null 값이 있는지 확인용
export const checkHasNullValues = (
  data: ResponseSearchNlDto | null
): boolean => {
  if (!data?.results || data.results.length === 0) return false;
  return data.results.some(
    (result) =>
      !result.demographic_info ||
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
