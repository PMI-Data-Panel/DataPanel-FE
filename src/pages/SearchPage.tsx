import { useSearch } from "../hooks/useSearch";
import usePostSearch from "../hooks/queries/usePostSearch";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Loading from "../components/SearchPage/Loading";
import AreaChart from "../components/common/graph/AreaChart";
import BarChart from "../components/common/graph/BarChart";
import PieChart from "../components/common/graph/PieChart";
import TreeMap from "../components/common/graph/TreeMap";
import { TOTAL_PANEL_COUNT } from "../constants/number";
import { useGetAllStatistics } from "../hooks/queries/useGetVisualization";
import type { AllStatisticsResponse, Distribution } from "../types/search";
import { Menu, X } from "lucide-react";
import SearchKeywords from "../components/SearchPage/SearchKeywords";
import SearchForm from "../components/SearchPage/SearchForm";
import LandingText from "../components/common/LandingText";
import SideBar, { type CategoryType } from "../components/common/SideBar";
import { useVisualization } from "../hooks/useVisualization";

// 시연용 예시 키워드
const keywords = [
  "서울에 사는 ott 구독자",
  "술담배 좋아하는 30대",
  "반려동물 키우는 20대 여성",
];

// StatisticsCharts 컴포넌트
const StatisticsCharts = ({
  data,
  selectedCategory,
  categoryFilter,
}: {
  data: AllStatisticsResponse;
  selectedCategory: CategoryType | null;
  categoryFilter: string;
}) => {
  const {
    selectedRegion,
    getFilteredSubRegionData,
    handleRegionClick,
    handleCloseSubRegion,
    getFilteredGroups,
  } = useVisualization(data);

  // 선택된 지역이 있으면 세부 지역 차트 표시
  const filteredSubRegionData = selectedRegion
    ? getFilteredSubRegionData()
    : [];

  // 차트 렌더링 헬퍼 함수
  const renderChart = (chart: {
    key: string;
    title: string;
    data: Distribution[];
    type: "pie" | "bar" | "treemap" | "area";
    colors?: string[];
  }) => {
    return (
      <div key={chart.key} className="group relative">
        <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="relative">
            {chart.type === "pie" && (
              <PieChart
                data={chart.data}
                title={chart.title}
                colors={chart.colors}
              />
            )}
            {chart.type === "bar" && (
              <BarChart
                data={chart.data}
                title={chart.title}
                onBarClick={
                  chart.key === "q_region" ? handleRegionClick : undefined
                }
                scrollable={
                  chart.title.includes("직업") ||
                  chart.title.includes("직무") ||
                  chart.title.includes("가전제품") ||
                  chart.title.includes("보유 휴대폰 브랜드") ||
                  chart.title.includes("보유 휴대폰 모델") ||
                  chart.title.includes("자동차 제조사") ||
                  chart.title.includes("자동차 모델") ||
                  chart.title.includes("담배브랜드") ||
                  chart.title.includes("흡연경험") ||
                  chart.title.includes("음용경험") ||
                  chart.title.includes("술") ||
                  chart.title.includes("지역") ||
                  chart.key === "q_region" ||
                  chart.key === "q_sub_region"
                }
              />
            )}
            {chart.type === "treemap" && (
              <TreeMap
                data={chart.data}
                title={chart.title}
                onItemClick={
                  chart.key === "q_region" ? handleRegionClick : undefined
                }
              />
            )}
            {chart.type === "area" && (
              <AreaChart
                data={chart.data}
                title={chart.title}
                color={chart.colors?.[0] || "#3b82f6"}
              />
            )}
          </div>

          <div className="px-4 pb-4 pt-2 border-t border-gray-50 bg-gradient-to-b from-white to-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">실시간 데이터</span>
              </div>
              <div className="text-xs text-gray-400">
                {chart.data.length}개 항목
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredGroups = getFilteredGroups(selectedCategory, categoryFilter);

  return (
    <div className="space-y-6">
      {selectedRegion && filteredSubRegionData.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-base md:text-lg font-semibold text-gray-700">
                  {selectedRegion} 세부 지역
                </h3>
              </div>
              <button
                onClick={handleCloseSubRegion}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ← 전체 지역 보기
              </button>
            </div>
            <TreeMap data={filteredSubRegionData} title="" />
          </div>
        </div>
      )}

      {/* 선택된 카테고리의 차트들 */}
      {selectedCategory && filteredGroups.length > 0 ? (
        filteredGroups.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className={`grid gap-6 md:gap-8 ${
              group.cols === 1
                ? "grid-cols-1"
                : group.cols === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {group.charts.map(renderChart)}
          </div>
        ))
      ) : selectedCategory ? (
        <div className="text-center py-20 font-bold text-black">
          {categoryFilter.trim()
            ? "필터 조건에 맞는 차트가 없습니다."
            : "차트가 없습니다."}
        </div>
      ) : (
        <div className="text-center py-20 font-bold text-black">
          왼쪽에서 카테고리를 선택해보세요.
        </div>
      )}
    </div>
  );
};

const SearchPage = () => {
  const { query, setQuery, addSearchHistory, setSearchResults } = useSearch();
  const { mutate, isPending, isSuccess, data, reset } = usePostSearch();
  const navigate = useNavigate();
  const isInitialized = useRef(false);
  const { data: statisticsData, isLoading: isLoadingStatistics } =
    useGetAllStatistics();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const { getCategoryChartCount } = useVisualization(statisticsData);

  // 페이지 마운트시 검색어 초기화
  useEffect(() => {
    if (!isInitialized.current) {
      setQuery("");
      isInitialized.current = true;
    }
  }, [setQuery]);

  // 검색 성공 시 결과를 context에 저장하고 페이지 이동
  useEffect(() => {
    if (isSuccess && data) {
      console.log("🔴 검색 성공, 결과 저장 후 navigate", data);
      setSearchResults(data);
      navigate("/search/results");
    }
  }, [isSuccess, data, setSearchResults, navigate]);

  const handleSearch = async (searchQuery: string) => {
    console.log("🔴 사용자가 입력한 검색어: ", searchQuery);
    // 전에 성공했었다면 리셋
    if (isSuccess) {
      reset();
    }

    // 검색어를 context에 저장
    await setQuery(searchQuery);

    // 검색 내역에 추가
    addSearchHistory(searchQuery);

    // API 호출 (첫 페이지, 페이지 크기 30000 - 전체 데이터를 받아옴)
    const requestBody = {
      query: searchQuery,
      use_vector_search: true,
      page: 1,
      page_size: 30000,
    };
    console.log(
      "🔴 SearchPage - 요청 Body:",
      JSON.stringify(requestBody, null, 2)
    );
    console.log("🔴 SearchPage - page_size 값:", requestBody.page_size);
    mutate(requestBody);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white relative w-full max-w-full overflow-hidden">
      {/* 데스크톱 사이드바 - 왼쪽에 위치 (lg 이상) */}
      <div className="hidden lg:block">
        <SideBar
          isOpen={isSidebarOpen}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          totalUsers={statisticsData?.total_users || TOTAL_PANEL_COUNT}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          getCategoryChartCount={getCategoryChartCount}
        />
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* 사이드바 토글 버튼 (데스크톱에서만 표시) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute top-4 left-4 z-50 p-2 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200 items-center justify-center bg-blue-800 cursor-pointer"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>

        {/* 검색중이라면 로딩화면 */}
        {isPending ? (
          <Loading />
        ) : (
          <div className="flex-1 overflow-y-auto bg-white">
            {/* 검색 바 섹션 */}
            <div className="px-6 py-10 md:px-10 md:py-30">
              {/* 상단 안내 텍스트 */}
              <LandingText
                titleTextFront="검색하고 싶은 데이터를 "
                titleTextSpan="자연어로"
                titleTextBack="입력하세요"
              />

              {/* 검색 입력 필드 */}
              <div className="relative my-8 max-w-2xl mx-auto">
                <SearchForm
                  searchQuery={query}
                  setSearchQuery={(query) => setQuery(query)}
                  handleSearch={() => handleSearch(query)}
                  isSearching={isPending}
                />
              </div>

              {/* 제안 검색어 */}
              <div className="flex flex-wrap gap-3 justify-center">
                <SearchKeywords
                  placeholder={keywords[0]}
                  setKeyword={() => setQuery(keywords[0])}
                  handleSearch={() => handleSearch(keywords[0])}
                />

                <SearchKeywords
                  placeholder={keywords[1]}
                  setKeyword={() => setQuery(keywords[1])}
                  handleSearch={() => handleSearch(keywords[1])}
                />

                <SearchKeywords
                  placeholder={keywords[2]}
                  setKeyword={() => setQuery(keywords[2])}
                  handleSearch={() => handleSearch(keywords[2])}
                />
              </div>
            </div>

            {/* 모바일/태블릿 사이드바 - 추천검색어 아래 위치 (lg 미만) */}
            <div className="block lg:hidden px-6 pb-4">
              <SideBar
                isOpen={true}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                totalUsers={statisticsData?.total_users || TOTAL_PANEL_COUNT}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                getCategoryChartCount={getCategoryChartCount}
              />
            </div>

            {/* 차트 영역 */}
            <div className="p-6 bg-white">
              {isLoadingStatistics ? (
                <div className="flex items-center justify-center py-20">
                  <div className="font-bold text-black">
                    데이터를 불러오는 중...
                  </div>
                </div>
              ) : statisticsData ? (
                <StatisticsCharts
                  data={statisticsData}
                  selectedCategory={selectedCategory}
                  categoryFilter={categoryFilter}
                />
              ) : (
                <div className="text-center py-20 font-bold text-black">
                  데이터가 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
