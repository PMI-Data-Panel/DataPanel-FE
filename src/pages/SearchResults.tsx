import { useState, useMemo, useEffect } from "react";
import { Home } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import AdditionalSearch from "../components/SearchResults/AdditionalSearch";
import AISearchResult from "../components/SearchResults/AISearchResult";
import Sidebar from "../components/SearchPage/Sidebar";
import NullWarning from "../components/SearchResults/NullWarning";
import PanelListModal from "../components/SearchResults/PanelListModal";
import Pagination from "../components/SearchResults/Pagination";
import SearchResultsList from "../components/SearchResults/SearchResultsList";
import usePostSearch from "../hooks/queries/usePostSearch";
import type { SearchNlResults, Distribution } from "../types/search";
import {
  calculateGenderData,
  calculateAgeData,
  calculateRegionData,
  calculateResidenceData,
  checkHasNullValues,
} from "../utils/chartDataCalculators";
import BarChart from "../components/common/graph/BarChart";
import TreeMapComponent from "../components/common/graph/TreeMap";

const SearchResults = () => {
  const { query, searchResults: data, setSearchResults } = useSearch();
  const { mutate, isPending } = usePostSearch();
  const [additionalQuery, setAdditionalQuery] = useState(""); // 추후 가능하다면 추가검색 구현 예정
  const navigate = useNavigate();

  // 패널 목록 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredPanels, setFilteredPanels] = useState<SearchNlResults[]>([]);
  const [filterInfo, setFilterInfo] = useState({ label: "", type: "" });

  // 그래프 데이터 계산
  const genderData = useMemo(() => calculateGenderData(data), [data]);
  const ageData = useMemo(() => calculateAgeData(data), [data]);
  const regionData = useMemo(() => calculateRegionData(data), [data]);
  const residenceData = useMemo(() => calculateResidenceData(data), [data]);
  const hasNullValues = useMemo(() => checkHasNullValues(data), [data]);

  // 그래프 클릭 시 해당 항목 필터링
  const handleGenderClick = (clickedData: Distribution) => {
    if (!data?.results) return;
    const filtered = data.results.filter(
      (panel) => panel.demographic_info?.gender === clickedData.label
    );
    setFilteredPanels(filtered);
    setFilterInfo({ label: String(clickedData.label), type: "성별 분포" });
    setIsModalOpen(true);
  };

  const handleAgeClick = (clickedData: Distribution) => {
    if (!data?.results) return;
    const filtered = data.results.filter(
      (panel) => panel.demographic_info?.age_group === clickedData.label
    );
    setFilteredPanels(filtered);
    setFilterInfo({ label: String(clickedData.label), type: "연령대 분포" });
    setIsModalOpen(true);
  };

  const handleRegionClick = (clickedData: Distribution) => {
    if (!data?.results) return;
    const filtered = data.results.filter(
      (panel) => panel.demographic_info?.region === clickedData.label
    );
    setFilteredPanels(filtered);
    setFilterInfo({ label: String(clickedData.label), type: "지역 분포" });
    setIsModalOpen(true);
  };

  const handleResidenceClick = (clickedData: Distribution) => {
    if (!data?.results) return;
    const filtered = data.results.filter(
      (panel) => panel.demographic_info?.sub_region === clickedData.label
    );
    setFilteredPanels(filtered);
    setFilterInfo({ label: String(clickedData.label), type: "거주지 분포" });
    setIsModalOpen(true);
  };

  const handleAdditionalSearch = () => {
    if (additionalQuery.trim()) {
      console.log("추가 검색:", additionalQuery);
      // 나중에 백엔드측에서 가능하면 구현 예정
    }
  };

  // 페이징 처리
  const handlePageChange = (newPage: number) => {
    if (!data || isPending) return;

    const requestBody = {
      query: query,
      use_vector_search: true,
      page: newPage,
      page_size: 20, // 항상 20으로 고정
    };
    console.log("🔵 SearchResults - 페이징 요청 Body:", JSON.stringify(requestBody, null, 2));
    console.log("🔵 SearchResults - page_size 값:", requestBody.page_size);
    
    mutate(
      requestBody,
      {
        onSuccess: (newData) => {
          setSearchResults(newData);
          // 페이지 상단으로 스크롤
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      }
    );
  };

  // 검색 결과가 변경되면 페이지 상단으로 스크롤
  useEffect(() => {
    if (data?.page) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [data?.page]);

  // 데이터가 없으면 검색 페이지로 리다이렉트
  useEffect(() => {
    if (!data) {
      navigate("/search");
    }
  }, [data, navigate]);

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">검색 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative w-full max-w-full overflow-x-hidden">
      {/* 좌측에 호버하면 나오는 사이드바 (데스크탑만) */}
      <div className="hidden md:block">
        <Sidebar open={false} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 w-full min-w-0 p-4 md:pl-16 md:pr-8 md:py-8 lg:pl-20 lg:pr-15 lg:py-15">
        {data && (
          <div className="space-y-4 md:space-y-6 w-full max-w-full">
            {/* 제목 */}
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                분석 결과
              </h1>
              <button
                onClick={() => navigate("/search")}
                className="px-3 py-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 md:gap-2 shrink-0"
              >
                <Home className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline text-sm md:text-base">
                  홈
                </span>
              </button>
            </div>

            {/* AI 분석 요약 */}
            <AISearchResult query={query} data={data} />

            {/* 이 패널들 중에서 추가 검색 */}
            <AdditionalSearch
              additionalQuery={additionalQuery}
              setAdditionalQuery={setAdditionalQuery}
              handleAdditionalSearch={handleAdditionalSearch}
            />

            {/* Null 값 주의 문구 */}
            {hasNullValues && <NullWarning />}

            {/* 막대그래프 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* 성별 분포 */}
              {genderData.length > 0 && (
                <BarChart
                  data={genderData}
                  title="성별 분포"
                  onBarClick={handleGenderClick}
                />
              )}

              {/* 연령대 분포 */}
              {ageData.length > 0 && (
                <BarChart
                  data={ageData}
                  title="연령대 분포"
                  onBarClick={handleAgeClick}
                />
              )}
            </div>

            {/* 트리맵 차트 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* 지역 분포 */}
              {regionData.length > 0 && (
                <TreeMapComponent
                  data={regionData}
                  title="지역 분포"
                  onItemClick={handleRegionClick}
                />
              )}

              {/* 거주지 분포 */}
              {residenceData.length > 0 && (
                <TreeMapComponent
                  data={residenceData}
                  title="거주지 분포"
                  onItemClick={handleResidenceClick}
                />
              )}
            </div>

            {/* 검색 결과 리스트 */}
            <SearchResultsList data={data} />

            {/* 페이징 */}
            <Pagination
              currentPage={data.page}
              pageSize={data.page_size}
              totalHits={data.total_hits}
              hasMore={data.has_more}
              onPageChange={handlePageChange}
              isLoading={isPending}
            />
          </div>
        )}
      </div>

      {/* 패널 목록 모달 */}
      <PanelListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        panels={filteredPanels}
        filterLabel={filterInfo.label}
        filterType={filterInfo.type}
      />
    </div>
  );
};

export default SearchResults;
