import { useState, useMemo, useEffect, useRef } from "react";
import { Home, MessageSquare, X } from "lucide-react";
import { useSearch } from "../hooks/useSearch";
import { useNavigate } from "react-router-dom";
import AISearchResult from "../components/SearchResults/AISearchResult";
import AIChat from "../components/SearchResults/AIChat";
import Sidebar from "../components/SearchPage/Sidebar";
import NullWarning from "../components/SearchResults/NullWarning";
import PanelListModal from "../components/SearchResults/PanelListModal";
import ResidenceModal from "../components/SearchResults/ResidenceModal";
import Pagination from "../components/SearchResults/Pagination";
import SearchResultsList from "../components/SearchResults/SearchResultsList";
import usePostSearch from "../hooks/queries/usePostSearch";
import type { SearchNlResults, Distribution } from "../types/search";
import {
  calculateGenderData,
  calculateAgeData,
  calculateRegionData,
  calculatePanelData,
  checkHasNullValues,
} from "../utils/chartDataCalculators";
import BarChart from "../components/common/graph/BarChart";
import GenderChart from "../components/common/graph/GenderChart";
import TreeMapComponent from "../components/common/graph/TreeMap";
import AreaChartComponent from "../components/common/graph/AreaChart";

const SearchResults = () => {
  const { query, searchResults: data } = useSearch();
  const { isPending } = usePostSearch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1); // 클라이언트 사이드 페이징을 위한 현재 페이지
  const DISPLAY_PAGE_SIZE = 10; // 화면에 표시할 페이지 크기
  const resultsListRef = useRef<HTMLDivElement>(null); // 검색 결과 리스트 참조
  const isInitialLoadRef = useRef(true); // 처음 로드인지 확인하는 플래그
  const prevDataRef = useRef<typeof data>(null); // 이전 데이터 참조

  // 채팅창 열림/닫힘 상태
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 패널 목록 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredPanels, setFilteredPanels] = useState<SearchNlResults[]>([]);
  const [filterInfo, setFilterInfo] = useState({ label: "", type: "" });

  // 거주지 모달 상태
  const [isResidenceModalOpen, setIsResidenceModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedRegionPanels, setSelectedRegionPanels] = useState<SearchNlResults[]>([]);

  // 그래프 데이터 계산
  const genderData = useMemo(() => calculateGenderData(data), [data]);
  const ageData = useMemo(() => calculateAgeData(data), [data]);
  const regionData = useMemo(() => calculateRegionData(data), [data]);
  const panelData = useMemo(() => calculatePanelData(data), [data]);
  const hasNullValues = useMemo(() => checkHasNullValues(data), [data]);

  // 선택된 지역의 거주지 데이터 계산
  const selectedRegionResidenceData = useMemo(() => {
    if (!selectedRegion || !data?.results) return [];
    
    const filteredResults = data.results.filter(
      (panel) => panel.demographic_info?.region === selectedRegion
    );
    
    if (filteredResults.length === 0) return [];

    const residenceCount: Record<string, number> = {};
    const totalCount = filteredResults.length;

    filteredResults.forEach((result) => {
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
      .sort((a, b) => b.value - a.value);
  }, [selectedRegion, data]);

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
    // 해당 지역의 패널 필터링
    const filtered = data.results.filter(
      (panel) => panel.demographic_info?.region === clickedData.label
    );
    setSelectedRegion(clickedData.label);
    setSelectedRegionPanels(filtered);
    setIsResidenceModalOpen(true);
  };

  const handlePanelClick = (clickedData: Distribution) => {
    if (!data?.results) return;
    // 해당 패널의 패널 필터링
    const filtered = data.results.filter((panel) => {
      const panelValue = 
        panel.panel || 
        (panel as { metadata?: { panel?: string } }).metadata?.panel ||
        (panel as { demographic_info?: { panel?: string } }).demographic_info?.panel ||
        (panel as { panel_name?: string }).panel_name ||
        (panel as { panel_type?: string }).panel_type;
      const normalizedPanel = panelValue === null || panelValue === undefined || panelValue === ""
        ? "미정"
        : String(panelValue).trim();
      return normalizedPanel === clickedData.label;
    });
    setFilteredPanels(filtered);
    setFilterInfo({ label: String(clickedData.label), type: "패널 분포" });
    setIsModalOpen(true);
  };



  // 클라이언트 사이드 페이징 처리
  const handlePageChange = (newPage: number) => {
    if (!data || isPending) return;
    setCurrentPage(newPage);
    // 검색 결과 리스트로 스크롤
    setTimeout(() => {
      resultsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        resultsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      <div className="flex-1 w-full min-w-0 p-3 md:pl-16 md:pr-6 md:py-4 lg:pl-20 lg:pr-12 lg:py-6">
        {data && (
          <div className="space-y-3 md:space-y-4 w-full max-w-full">
            {/* 제목 */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold text-[#191f28]">
                분석 결과
              </h1>
              <button
                onClick={() => navigate("/search")}
                className="px-3 py-2 bg-white text-[#191f28] rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 shrink-0 shadow-sm border border-gray-100"
              >
                <Home className="w-4 h-4 md:w-4 md:h-4" />
                <span className="hidden sm:inline text-xs md:text-sm font-medium">
                  홈
                </span>
              </button>
            </div>

            {/* AI 분석 요약/사용자 목록과 차트를 좌우로 분할 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
              {/* 왼쪽: AI 분석 요약과 사용자 목록 */}
              <div className="flex flex-col space-y-4 md:space-y-6">
                {/* AI 분석 요약 */}
                <div className="flex-1 overflow-y-auto">
                  <AISearchResult query={query} data={data} />
                </div>

                {/* Null 값 주의 문구 */}
                {hasNullValues && <NullWarning />}

                {/* 사용자 목록 영역 */}
                <div ref={resultsListRef} className="flex flex-col space-y-4">
                  <div className="flex-1">
                    <SearchResultsList
                      data={{
                        ...data,
                        results: displayedResults,
                        total_hits: data.results?.length || 0,
                      }}
                      allResults={data.results || []}
                      query={query}
                    />
                  </div>
                  
                  {/* 페이징 */}
                  <div className="shrink-0">
                    <Pagination
                      currentPage={currentPage}
                      pageSize={DISPLAY_PAGE_SIZE}
                      totalHits={data.results?.length || 0}
                      hasMore={currentPage < totalPages}
                      onPageChange={handlePageChange}
                      isLoading={isPending}
                    />
                  </div>
                </div>
              </div>

              {/* 오른쪽: 차트 영역 - 세로로 일렬 배치 */}
              <div className="flex flex-col gap-4 md:gap-6">
                {/* 성별 분포 */}
                {genderData.length > 0 && (
                  <GenderChart
                    data={genderData}
                    title="성별 분포"
                    onItemClick={handleGenderClick}
                  />
                )}

                {/* 연령대 분포 */}
                {ageData.length > 0 && (
                  <BarChart
                    data={ageData}
                    title="연령대 분포"
                    onBarClick={handleAgeClick}
                    customHeight={350}
                  />
                )}

                {/* 지역 분포 */}
                {regionData.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <AreaChartComponent
                      data={[...regionData].sort((a, b) => a.label.localeCompare(b.label))}
                      title="지역 분포"
                      dataKey="value"
                      xAxisKey="label"
                      color="#3b82f6"
                      areaType="monotone"
                      onItemClick={handleRegionClick}
                    />
                  </div>
                )}

                {/* 패널 분포 */}
                {panelData.length > 0 && (
                  <BarChart
                    data={panelData}
                    title="패널 분포"
                    onBarClick={handlePanelClick}
                  />
                )}
              </div>
            </div>
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

      {/* 거주지 분포 모달 */}
      <ResidenceModal
        isOpen={isResidenceModalOpen}
        onClose={() => {
          setIsResidenceModalOpen(false);
          setSelectedRegion(null);
          setSelectedRegionPanels([]);
        }}
        regionName={selectedRegion || ""}
        panels={selectedRegionPanels}
        residenceData={selectedRegionResidenceData}
        onResidenceClick={(clickedData) => {
          if (!data?.results) return;
          const filtered = selectedRegionPanels.filter(
            (panel) => panel.demographic_info?.sub_region === clickedData.label
          );
          setFilteredPanels(filtered);
          setFilterInfo({ label: String(clickedData.label), type: "거주지 분포" });
          setIsResidenceModalOpen(false);
          setIsModalOpen(true);
        }}
      />

      {/* 하단 고정 채팅창 */}
      {data && (
        <>
          {/* 채팅창 토글 버튼 - 항상 표시 */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`fixed ${isChatOpen ? 'bottom-[520px] md:bottom-[620px] right-4' : 'bottom-4 right-4'} bg-[#3182f6] text-white rounded-full p-3 md:p-4 shadow-xl hover:bg-[#1b64da] transition-all duration-300 z-[60] flex items-center justify-center`}
            aria-label={isChatOpen ? "채팅창 닫기" : "채팅창 열기"}
          >
            {isChatOpen ? (
              <X className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>

          {/* 채팅창 */}
          <div className={`fixed bottom-0 right-0 left-0 md:left-auto md:right-4 md:bottom-4 md:w-[450px] z-50 transition-all duration-300 ${isChatOpen ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="bg-white rounded-t-xl md:rounded-xl shadow-2xl border border-gray-200 h-[500px] md:h-[600px] max-h-[80vh] flex flex-col overflow-hidden">
              <AIChat query={query} sessionId={data?.session_id} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
