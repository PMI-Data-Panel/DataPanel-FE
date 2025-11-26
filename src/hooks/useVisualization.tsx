import { useMemo, useState } from "react";
import type { AllStatisticsResponse, Distribution } from "../types/search";
import type { CategoryType } from "../components/common/SideBar";

// 차트 아이템 타입
export type ChartItem = {
  key: string;
  title: string;
  data: Distribution[];
  type: "pie" | "bar" | "treemap" | "area";
  colors?: string[];
};

// 차트 그룹 타입
export type ChartGroup = {
  charts: ChartItem[];
  cols: number;
};

// 카테고리별 차트 그룹 타입
export type CategoryGroups = Record<CategoryType, ChartGroup[]>;

export const useVisualization = (data: AllStatisticsResponse | undefined) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // 데이터를 Distribution 형식으로 변환
  const convertToDistribution = (
    answerDistribution: Array<{
      answer: string;
      count: number;
      percentage: number;
    }>,
    sortByNumber = false
  ): Distribution[] => {
    const distribution = answerDistribution.map((item) => {
      let label = item.answer;
      // 모든 차트에서 괄호와 그 안의 내용 제거 (여러 번 실행하여 중첩된 괄호도 제거)
      while (label.includes("(") || label.includes(")")) {
        label = label.replace(/\([^()]*\)/g, "").trim();
        // 불완전한 괄호도 제거 (여는 괄호만 있거나 닫는 괄호만 있는 경우)
        label = label.replace(/\([^)]*$/g, "").trim();
        label = label.replace(/^[^(]*\)/g, "").trim();
      }
      // 연속된 공백을 하나로 정리
      label = label.replace(/\s+/g, " ").trim();
      return {
        label,
        value: item.count,
        percentage: item.percentage,
      };
    });

    // 숫자로 정렬이 필요한 경우 (출생년도 등)
    if (sortByNumber) {
      return distribution.sort((a, b) => {
        const numA = parseInt(a.label);
        const numB = parseInt(b.label);
        if (isNaN(numA) || isNaN(numB)) {
          return a.label.localeCompare(b.label);
        }
        return numA - numB;
      });
    }

    return distribution;
  };

  // 선택된 지역에 해당하는 세부 지역 필터링
  const getFilteredSubRegionData = (): Distribution[] => {
    if (!selectedRegion || !data?.statistics.q_sub_region) return [];

    const allSubRegions = data.statistics.q_sub_region.answer_distribution;

    // 세부 지역 이름에 선택된 지역 이름이 포함되어 있는지 확인
    return allSubRegions
      .filter((item) => item.answer.includes(selectedRegion))
      .map((item) => ({
        label: item.answer,
        value: item.count,
        percentage: item.percentage,
      }))
      .sort((a, b) => b.value - a.value); // 값 기준 내림차순 정렬
  };

  // 차트를 카테고리별로 분류
  const categorizedCharts = useMemo(() => {
    if (!data) return {} as CategoryGroups;

    const categories: Record<CategoryType, ChartItem[]> = {
      demographics: [],
      region: [],
      education: [],
      income: [],
      lifestyle: [],
      consumption: [],
    };

    const statistics = data.statistics;
    const keys = Object.keys(statistics);

    keys.forEach((key) => {
      const stat = statistics[key];
      const distribution = convertToDistribution(
        stat.answer_distribution,
        key === "q_birth_year"
      );
      const answerCount = distribution.length;
      const desc = stat.question_description;

      // 차트 타입 결정
      let chartType: "pie" | "bar" | "treemap" | "area" = "pie";
      let colors: string[] | undefined;

      if (key === "q_region" || key === "q_sub_region") {
        chartType = "bar";
      } else if (desc.includes("흡연경험") || desc.includes("최종학력")) {
        chartType = "bar";
      } else if (
        key === "q_personal_income" ||
        key === "q_household_income" ||
        key === "q_birth_year"
      ) {
        chartType = "area";
        colors = ["#3b82f6"];
      } else if (
        key === "q_age" ||
        key === "q_family_count" ||
        key === "q_children_count"
      ) {
        chartType = "bar";
      } else if (answerCount > 10) {
        chartType = "bar";
      } else if (answerCount <= 3) {
        chartType = "pie";
        if (key === "q_gender") {
          colors = ["#3b82f6", "#ec4899", "#8b5cf6"];
        } else if (key === "q_marriage") {
          colors = ["#8b5cf6", "#ec4899", "#10b981"];
        } else if (key === "q_car_owned") {
          colors = ["#10b981", "#06b6d4"];
        }
      } else {
        chartType = "pie";
      }

      const chartItem: ChartItem = {
        key,
        title: desc,
        data: distribution,
        type: chartType,
        colors,
      };

      // 카테고리 분류
      if (
        key === "q_gender" ||
        key === "q_age" ||
        key === "q_birth_year" ||
        key === "q_marriage" ||
        key === "q_family_count" ||
        key === "q_children_count"
      ) {
        categories.demographics.push(chartItem);
      } else if (key === "q_region" || key === "q_sub_region") {
        categories.region.push(chartItem);
      } else if (
        desc.includes("최종학력") ||
        desc.includes("직업") ||
        desc.includes("직무")
      ) {
        categories.education.push(chartItem);
      } else if (key === "q_personal_income" || key === "q_household_income") {
        categories.income.push(chartItem);
      } else if (
        desc.includes("흡연경험") ||
        desc.includes("음용경험") ||
        desc.includes("술") ||
        desc.includes("담배브랜드")
      ) {
        categories.lifestyle.push(chartItem);
      } else if (
        desc.includes("가전제품") ||
        desc.includes("보유 휴대폰") ||
        desc.includes("자동차") ||
        key === "q_car_owned"
      ) {
        categories.consumption.push(chartItem);
      } else {
        // 기본적으로 인구통계에 포함
        categories.demographics.push(chartItem);
      }
    });

    // 각 카테고리의 차트들을 그룹화
    const categoryGroups: CategoryGroups = {
      demographics: [],
      region: [],
      education: [],
      income: [],
      lifestyle: [],
      consumption: [],
    };

    // 카테고리별 그룹화 로직
    Object.keys(categories).forEach((catKey) => {
      const category = catKey as CategoryType;
      const charts = categories[category];

      // 지역: 2개씩 묶기
      if (category === "region") {
        if (charts.length > 0) {
          categoryGroups[category].push({ charts, cols: 2 });
        }
      }
      // 교육/직업: 직업/직무는 2개씩, 최종학력은 별도
      else if (category === "education") {
        const jobCharts = charts.filter(
          (c) => c.title.includes("직업") || c.title.includes("직무")
        );
        const educationCharts = charts.filter((c) =>
          c.title.includes("최종학력")
        );

        if (jobCharts.length > 0) {
          categoryGroups[category].push({ charts: jobCharts, cols: 2 });
        }
        educationCharts.forEach((chart) => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
      // 소득: 각각 1개씩
      else if (category === "income") {
        charts.forEach((chart) => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
      // 생활패턴: 흡연경험과 기타를 분리
      else if (category === "lifestyle") {
        const smokerCharts = charts.filter((c) => c.title.includes("흡연경험"));
        const otherCharts = charts.filter((c) => !c.title.includes("흡연경험"));

        if (smokerCharts.length > 0) {
          categoryGroups[category].push({ charts: smokerCharts, cols: 1 });
        }
        otherCharts.forEach((chart) => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
      // 소비/보유: 가족수/자녀수는 2개씩, 나머지는 1개씩
      else if (category === "consumption") {
        const familyCharts = charts.filter(
          (c) => c.title.includes("가족수") || c.title.includes("자녀수")
        );
        const otherCharts = charts.filter(
          (c) => !c.title.includes("가족수") && !c.title.includes("자녀수")
        );

        if (familyCharts.length > 0) {
          categoryGroups[category].push({ charts: familyCharts, cols: 2 });
        }
        // 제품 관련 차트들을 2개씩 묶기
        const productCharts = otherCharts.filter(
          (c) =>
            c.title.includes("가전제품") ||
            c.title.includes("보유 휴대폰") ||
            c.title.includes("자동차")
        );
        const restCharts = otherCharts.filter(
          (c) =>
            !c.title.includes("가전제품") &&
            !c.title.includes("보유 휴대폰") &&
            !c.title.includes("자동차")
        );

        if (productCharts.length > 0) {
          for (let i = 0; i < productCharts.length; i += 2) {
            categoryGroups[category].push({
              charts: productCharts.slice(i, i + 2),
              cols: 2,
            });
          }
        }
        restCharts.forEach((chart) => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
      // 인구통계: 파이차트는 2개씩, 나머지는 1개씩
      else {
        const pieCharts = charts.filter((c) => c.type === "pie");
        const barCharts = charts.filter((c) => c.type === "bar");
        const areaCharts = charts.filter((c) => c.type === "area");

        // 파이차트 2개씩 묶기
        for (let i = 0; i < pieCharts.length; i += 2) {
          categoryGroups[category].push({
            charts: pieCharts.slice(i, i + 2),
            cols: 2,
          });
        }

        // 가족수/자녀수는 2개씩
        const familyCharts = barCharts.filter(
          (c) => c.title.includes("가족수") || c.title.includes("자녀수")
        );
        const otherBarCharts = barCharts.filter(
          (c) => !c.title.includes("가족수") && !c.title.includes("자녀수")
        );

        if (familyCharts.length > 0) {
          categoryGroups[category].push({ charts: familyCharts, cols: 2 });
        }

        otherBarCharts.forEach((chart) => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });

        // Area 차트는 각각 1개씩
        areaCharts.forEach((chart) => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
    });

    return categoryGroups;
  }, [data]);

  // 지역 차트 클릭 핸들러
  const handleRegionClick = (item: Distribution) => {
    setSelectedRegion(item.label);
  };

  // 세부 지역 차트 닫기
  const handleCloseSubRegion = () => {
    setSelectedRegion(null);
  };

  // 필터링된 차트 그룹 가져오기
  const getFilteredGroups = (
    selectedCategory: CategoryType | null,
    categoryFilter: string
  ): ChartGroup[] => {
    if (!selectedCategory) return [];

    let groups = categorizedCharts[selectedCategory];

    // 필터 적용
    if (categoryFilter.trim()) {
      groups = groups
        .map((group) => ({
          ...group,
          charts: group.charts.filter((chart) =>
            chart.title.toLowerCase().includes(categoryFilter.toLowerCase())
          ),
        }))
        .filter((group) => group.charts.length > 0);
    }

    return groups;
  };

  // 카테고리별 차트 개수 계산
  const getCategoryChartCount = useMemo(() => {
    if (!data) return () => 0;

    const counts: Record<CategoryType, number> = {
      demographics: 0,
      region: 0,
      education: 0,
      income: 0,
      lifestyle: 0,
      consumption: 0,
    };

    const statistics = data.statistics;
    const keys = Object.keys(statistics);

    keys.forEach((key) => {
      const stat = statistics[key];
      const desc = stat.question_description;

      if (
        key === "q_gender" ||
        key === "q_age" ||
        key === "q_birth_year" ||
        key === "q_marriage" ||
        key === "q_family_count" ||
        key === "q_children_count"
      ) {
        counts.demographics++;
      } else if (key === "q_region" || key === "q_sub_region") {
        counts.region++;
      } else if (
        desc.includes("최종학력") ||
        desc.includes("직업") ||
        desc.includes("직무")
      ) {
        counts.education++;
      } else if (key === "q_personal_income" || key === "q_household_income") {
        counts.income++;
      } else if (
        desc.includes("흡연경험") ||
        desc.includes("음용경험") ||
        desc.includes("술") ||
        desc.includes("담배브랜드")
      ) {
        counts.lifestyle++;
      } else if (
        desc.includes("가전제품") ||
        desc.includes("보유 휴대폰") ||
        desc.includes("자동차") ||
        key === "q_car_owned"
      ) {
        counts.consumption++;
      } else {
        counts.demographics++;
      }
    });

    return (categoryId: CategoryType) => counts[categoryId];
  }, [data]);

  return {
    selectedRegion,
    categorizedCharts,
    getFilteredSubRegionData,
    handleRegionClick,
    handleCloseSubRegion,
    getFilteredGroups,
    getCategoryChartCount,
  };
};
