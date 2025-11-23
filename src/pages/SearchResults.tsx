import { useState, useMemo, useEffect, useRef } from "react";
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
  const { query, searchResults: data } = useSearch();
  const { isPending } = usePostSearch();
  const [additionalQuery, setAdditionalQuery] = useState(""); // 추후 가능하다면 추가검색 구현 예정
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // 클라이언트 사이드 페이징을 위한 현재 페이지
  const DISPLAY_PAGE_SIZE = 10; // 화면에 표시할 페이지 크기
  const resultsListRef = useRef<HTMLDivElement>(null); // 검색 결과 리스트 참조
  const isInitialLoadRef = useRef(true); // 처음 로드인지 확인하는 플래그
  const prevDataRef = useRef<typeof data>(null); // 이전 데이터 참조

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

  // 클라이언트 사이드 페이징 처리
  const handlePageChange = (newPage: number) => {
    if (!data || isPending) return;
    setCurrentPage(newPage);
    // 검색 결과 리스트로 스크롤
    setTimeout(() => {
      resultsListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // 현재 페이지에 표시할 데이터 계산
  const displayedResults = useMemo(() => {
    if (!data?.results) return [];
    const startIndex = (currentPage - 1) * DISPLAY_PAGE_SIZE;
    const endIndex = startIndex + DISPLAY_PAGE_SIZE;
    return data.results.slice(startIndex, endIndex);
  }, [data?.results, currentPage]);

  // 전체 페이지 수 계산
  const totalPages = useMemo(() => {
    if (!data?.results) return 1;
    return Math.ceil(data.results.length / DISPLAY_PAGE_SIZE);
  }, [data?.results]);

  // 데이터가 변경되면 첫 페이지로 리셋
  useEffect(() => {
    if (data) {
      // 새로운 검색 결과인지 확인 (이전 데이터와 다른 경우)
      const isNewSearch = prevDataRef.current !== data;

      if (isNewSearch) {
        // 새로운 검색 결과인 경우 최상단으로 스크롤
        setCurrentPage(1);
        isInitialLoadRef.current = true;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      prevDataRef.current = data;
    }
  }, [data]);

  // 페이징 시에만 사용자 목록으로 스크롤
  useEffect(() => {
    // 처음 로드가 아니고, 페이지가 변경된 경우에만 스크롤
    if (!isInitialLoadRef.current && currentPage > 1) {
      setTimeout(() => {
        resultsListRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } else if (isInitialLoadRef.current && data) {
      // 처음 로드 시 플래그를 false로 변경
      isInitialLoadRef.current = false;
    }
  }, [currentPage, data]);

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
    <div className="min-h-screen bg-[#f5f6f8] flex relative w-full max-w-full overflow-x-hidden">
      {/* 좌측에 호버하면 나오는 사이드바 (데스크탑만) */}
      <div className="hidden md:block">
        <Sidebar open={false} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 w-full min-w-0 p-4 md:pl-16 md:pr-8 md:py-8 lg:pl-20 lg:pr-15 lg:py-15">
        {data && (
          <div className="space-y-5 md:space-y-6 w-full max-w-full">
            {/* 제목 */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#191f28]">
                분석 결과
              </h1>
              <button
                onClick={() => navigate("/search")}
                className="px-4 py-2.5 bg-white text-[#191f28] rounded-2xl hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shrink-0 shadow-sm border border-gray-100"
              >
                <Home className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline text-sm md:text-base font-medium">
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
              <BarChart
                data={genderData}
                title="성별 분포"
                onBarClick={handleGenderClick}
              />

              {/* 연령대 분포 */}
              <BarChart
                data={ageData}
                title="연령대 분포"
                onBarClick={handleAgeClick}
              />
            </div>

            {/* 트리맵 차트 섹션 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* 지역 분포 */}
              <TreeMapComponent
                data={regionData}
                title="지역 분포"
                onItemClick={handleRegionClick}
              />

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
            <div ref={resultsListRef}>
              <SearchResultsList
                data={{
                  ...data,
                  results: displayedResults,
                  total_hits: data.results?.length || 0, // 클라이언트 사이드 페이징을 위해 전체 결과 개수 사용
                }}
                allResults={data.results || []} // 전체 검색 결과 데이터
                query={query} // 검색어
              />
            </div>

            {/* 페이징 */}
            <Pagination
              currentPage={currentPage}
              pageSize={DISPLAY_PAGE_SIZE}
              totalHits={data.results?.length || 0}
              hasMore={currentPage < totalPages}
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
