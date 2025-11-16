import { useState, useMemo } from "react";
import { Home } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import NotFoundPage from "./NotFoundPage";
import { useNavigate } from "react-router-dom";
import AdditionalSearch from "../components/SearchResults/AdditionalSearch";
import AISearchResult from "../components/SearchResults/AISearchResult";
import Sidebar from "../components/SearchPage/Sidebar";
import NullWarning from "../components/SearchResults/NullWarning";
import {
  calculateGenderData,
  calculateAgeData,
  calculateRegionData,
  calculateResidenceData,
  calculatePanelSourceData,
  checkHasNullValues,
} from "../utils/chartDataCalculators";
import { getAllMostFrequentValues } from "../utils/getMostFrequentValues";
import BarChart from "../components/common/graph/BarChart";
import NestedDonutChart from "../components/common/graph/NestedDonutChart";
import DonutChart from "../components/common/graph/DonutChart";

const SearchResults = () => {
  const { query, searchResults: data } = useSearch();
  const [additionalQuery, setAdditionalQuery] = useState(""); // 추후 가능하다면 추가검색 구현 예정
  const navigate = useNavigate();

  // 그래프 데이터 계산
  const genderData = useMemo(() => calculateGenderData(data), [data]);
  const ageData = useMemo(() => calculateAgeData(data), [data]);
  const regionData = useMemo(() => calculateRegionData(data), [data]);
  const residenceData = useMemo(() => calculateResidenceData(data), [data]);
  const panelSourceData = useMemo(() => calculatePanelSourceData(data), [data]);
  const hasNullValues = useMemo(() => checkHasNullValues(data), [data]);

  // 최빈값 계산
  const mostFrequentValues = useMemo(
    () =>
      getAllMostFrequentValues(
        genderData,
        ageData,
        regionData,
        residenceData,
        panelSourceData
      ),
    [genderData, ageData, regionData, residenceData, panelSourceData]
  );

  if (!data) {
    return <NotFoundPage />;
  }

  const handleAdditionalSearch = () => {
    if (additionalQuery.trim()) {
      console.log("추가 검색:", additionalQuery);
      // 나중에 백엔드측에서 가능하면 구현 예정
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* 좌측에 호버하면 나오는 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 p-15">
        {data && (
          <div className="space-y-6">
            {/* 제목 */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">분석 결과</h1>
              <button
                onClick={() => navigate("/search")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
              </button>
            </div>

            {/* AI 분석 요약 */}
            <AISearchResult
              query={query}
              data={data}
              mostFrequentValues={mostFrequentValues}
            />

            {/* 이 패널들 중에서 추가 검색 */}
            <AdditionalSearch
              additionalQuery={additionalQuery}
              setAdditionalQuery={setAdditionalQuery}
              handleAdditionalSearch={handleAdditionalSearch}
            />

            {/* Null 값 주의 문구 */}
            {hasNullValues && <NullWarning />}

            {/* 막대그래프 섹션 */}
            <div className="grid grid-cols-2 gap-6">
              {/* 성별 분포 */}
              {genderData.length > 0 && (
                <BarChart chartData={genderData} title="성별 분포" />
              )}

              {/* 연령대 분포 */}
              {ageData.length > 0 && (
                <BarChart chartData={ageData} title="연령대 분포" />
              )}
            </div>

            {/* 도넛 차트 섹션 */}
            <div className="grid grid-cols-2 gap-6 mt-6">
              {/* 지역 분포 (이중 도넛차트) */}
              {regionData.length > 0 && residenceData.length > 0 && (
                <NestedDonutChart
                  innerData={regionData}
                  outerData={residenceData}
                  title="거주지 분포"
                />
              )}

              {/* 설문지 출처 (일반 도넛차트) */}
              {panelSourceData.length > 0 && (
                <DonutChart chartData={panelSourceData} title="설문지 출처" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
