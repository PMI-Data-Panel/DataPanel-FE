import SearchForm from "../components/SearchPage/SearchForm";
import Sidebar from "../components/SearchPage/Sidebar";
import MobileSidebar from "../components/SearchPage/MobileSidebar";
import { useSearch } from "../hooks/useSearch";
import usePostSearch from "../hooks/queries/usePostSearch";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loading from "../components/SearchPage/Loading";
import SearchKeywords from "../components/SearchPage/SearchKeywords";
import AreaChart from "../components/common/graph/AreaChart";
import BarChart from "../components/common/graph/BarChart";
import PieChart from "../components/common/graph/PieChart";
import TreeMap from "../components/common/graph/TreeMap";
import { TOTAL_PANEL_COUNT } from "../constants/number";
import { useGetAllStatistics } from "../hooks/queries/useGetVisualization";
import type { AllStatisticsResponse, Distribution } from "../types/search";
import { useMemo, useState } from "react";

// 예시 검색 키워드
const example1 = "서울에 사는 ott 구독자";
const example2 = "술담배 좋아하는 30대";

// StatisticsCharts 컴포넌트
const StatisticsCharts = ({ data }: { data: AllStatisticsResponse }) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // 데이터를 Distribution 형식으로 변환
  const convertToDistribution = (
    answerDistribution: Array<{ answer: string; count: number; percentage: number }>,
    sortByNumber = false,
    questionKey?: string,
    questionDescription?: string
  ): Distribution[] => {
    const distribution = answerDistribution.map(item => {
      let label = item.answer;
      // 직업/직무, 음용경험 술 관련 질문인 경우 괄호와 그 안의 내용 제거
      const shouldRemoveParentheses = 
        (questionKey && (questionKey.includes('직업') || questionKey.includes('직무'))) ||
        (questionDescription && (questionDescription.includes('직업') || questionDescription.includes('직무'))) ||
        (questionKey && (questionKey.includes('음용경험') || questionKey.includes('술'))) ||
        (questionDescription && (questionDescription.includes('음용경험') || questionDescription.includes('술')));
      if (shouldRemoveParentheses) {
        // 괄호와 그 안의 모든 내용을 제거
        label = label.replace(/\([^()]*\)/g, '').trim();
        // 연속된 공백을 하나로 정리
        label = label.replace(/\s+/g, ' ').trim();
      }
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
    if (!selectedRegion || !data.statistics.q_sub_region) return [];
    
    const allSubRegions = data.statistics.q_sub_region.answer_distribution;
    
    // 세부 지역 이름에 선택된 지역 이름이 포함되어 있는지 확인
    return allSubRegions
      .filter(item => item.answer.includes(selectedRegion))
      .map(item => ({
        label: item.answer,
        value: item.count,
        percentage: item.percentage,
      }))
      .sort((a, b) => b.value - a.value); // 값 기준 내림차순 정렬
  };

  // 차트 타입 결정 및 그룹화
  const chartGroups = useMemo(() => {
    const groups: Array<{
      charts: Array<{
        key: string;
        title: string;
        data: Distribution[];
        type: 'pie' | 'bar' | 'treemap' | 'area';
        colors?: string[];
      }>;
      cols: number; // 그리드 컬럼 수 (1, 2, 3)
    }> = [];

    const statistics = data.statistics;
    const keys = Object.keys(statistics);
    
    // 파이차트와 다른 차트를 분리
    const pieCharts: Array<{
      key: string;
      title: string;
      data: Distribution[];
      type: 'pie';
      colors?: string[];
    }> = [];
    
    // BarChart는 한 줄에 하나씩 배치
    const barCharts: Array<{
      key: string;
      title: string;
      data: Distribution[];
      type: 'bar';
      colors?: string[];
    }> = [];
    
    // 자녀수와 가족수는 한 줄에 두 개씩 배치
    const familyBarCharts: Array<{
      key: string;
      title: string;
      data: Distribution[];
      type: 'bar';
      colors?: string[];
    }> = [];
    
    // 직업과 직무는 한 줄에 두 개씩 배치 (스크롤 가능)
    const jobBarCharts: Array<{
      key: string;
      title: string;
      data: Distribution[];
      type: 'bar';
      colors?: string[];
    }> = [];
    
    // 보유 가전제품, 보유 휴대폰 브랜드, 보유 휴대폰 모델, 자동차 제조사는 한 줄에 두 개씩 배치 (스크롤 가능)
    const productBarCharts: Array<{
      key: string;
      title: string;
      data: Distribution[];
      type: 'bar';
      colors?: string[];
    }> = [];
    
    let currentGroup: typeof groups[0]['charts'] = [];
    let currentCols = 3;

    keys.forEach((key) => {
      const stat = statistics[key];
      // 출생년도는 숫자 오름차순으로 정렬
      const distribution = convertToDistribution(stat.answer_distribution, key === 'q_birth_year', key, stat.question_description);
      const answerCount = distribution.length;

      // 차트 타입 결정
      let chartType: 'pie' | 'bar' | 'treemap' | 'area' = 'pie';
      let colors: string[] | undefined;

      // 특정 필드에 맞는 차트 타입 지정
      if (key === 'q_region' || key === 'q_sub_region') {
        chartType = 'treemap';
        currentCols = 1; // 거주지는 전체 너비
      } else if (key === 'q_personal_income' || key === 'q_household_income' || key === 'q_birth_year') {
        chartType = 'area';
        colors = ['#3b82f6'];
      } else if (key === 'q_age' || key === 'q_family_count' || key === 'q_children_count') {
        chartType = 'bar';
      } else if (answerCount > 10) {
        // 답변 개수가 많으면 BarChart
        chartType = 'bar';
      } else if (answerCount <= 3) {
        // 답변이 적으면 PieChart
        chartType = 'pie';
        if (key === 'q_gender') {
          colors = ['#3b82f6', '#ec4899', '#8b5cf6'];
        } else if (key === 'q_marriage') {
          colors = ['#8b5cf6', '#ec4899', '#10b981'];
        } else if (key === 'q_car_owned') {
          colors = ['#10b981', '#06b6d4'];
        }
      } else {
        chartType = 'pie';
      }

      // 거주지, 세부지역, 출생년도, 소득은 별도 그룹으로 (전체 너비)
      if (key === 'q_region' || key === 'q_sub_region' || key === 'q_birth_year' || key === 'q_personal_income' || key === 'q_household_income') {
        if (currentGroup.length > 0) {
          groups.push({ charts: currentGroup, cols: currentCols });
          currentGroup = [];
        }
        groups.push({
          charts: [{
            key,
            title: stat.question_description,
            data: distribution,
            type: chartType,
            colors,
          }],
          cols: 1,
        });
        currentCols = 3;
      } else if (chartType === 'pie') {
        // 파이차트는 별도로 수집
        pieCharts.push({
          key,
          title: stat.question_description,
          data: distribution,
          type: 'pie',
          colors,
        });
      } else if (chartType === 'bar') {
        // 자녀수와 가족수는 별도로 수집 (한 줄에 두 개씩)
        if (key === 'q_family_count' || key === 'q_children_count') {
          familyBarCharts.push({
            key,
            title: stat.question_description,
            data: distribution,
            type: 'bar',
            colors,
          });
        } else if (stat.question_description.includes('직업') || stat.question_description.includes('직무')) {
          // 직업과 직무는 별도로 수집 (한 줄에 두 개씩, 스크롤 가능)
          jobBarCharts.push({
            key,
            title: stat.question_description,
            data: distribution,
            type: 'bar',
            colors,
          });
        } else if (
          stat.question_description.includes('가전제품') || 
          stat.question_description.includes('보유 휴대폰 브랜드') || 
          stat.question_description.includes('보유 휴대폰 모델') || 
          stat.question_description.includes('자동차 제조사') ||
          stat.question_description.includes('자동차 모델') ||
          stat.question_description.includes('담배브랜드') ||
          stat.question_description.includes('흡연경험') ||
          stat.question_description.includes('음용경험') ||
          stat.question_description.includes('술')
        ) {
          // 보유 가전제품, 보유 휴대폰 브랜드, 보유 휴대폰 모델, 자동차 제조사, 자동차 모델, 흡연경험 담배브랜드, 음용경험 술은 별도로 수집 (한 줄에 두 개씩, 스크롤 가능)
          productBarCharts.push({
            key,
            title: stat.question_description,
            data: distribution,
            type: 'bar',
            colors,
          });
        } else {
          // 나머지 BarChart는 한 줄에 하나씩
          barCharts.push({
            key,
            title: stat.question_description,
            data: distribution,
            type: 'bar',
            colors,
          });
        }
      } else {
        // 다른 차트들 (area 등)
        currentGroup.push({
          key,
          title: stat.question_description,
          data: distribution,
          type: chartType,
          colors,
        });

        // 3개씩 그룹화
        if (currentGroup.length >= 3) {
          groups.push({ charts: currentGroup, cols: 3 });
          currentGroup = [];
        }
      }
    });

    // 자녀수와 가족수를 한 줄에 두 개씩 추가
    if (familyBarCharts.length > 0) {
      groups.push({
        charts: familyBarCharts,
        cols: 2,
      });
    }

    // 직업과 직무를 한 줄에 두 개씩 추가
    if (jobBarCharts.length > 0) {
      groups.push({
        charts: jobBarCharts,
        cols: 2,
      });
    }

    // 보유 가전제품, 보유 휴대폰 브랜드, 보유 휴대폰 모델, 자동차 제조사를 한 줄에 두 개씩 추가
    if (productBarCharts.length > 0) {
      groups.push({
        charts: productBarCharts,
        cols: 2,
      });
    }

    // 나머지 BarChart를 한 줄에 하나씩 추가
    barCharts.forEach((barChart) => {
      groups.push({
        charts: [barChart],
        cols: 1,
      });
    });

    // 파이차트를 2개씩 묶어서 그룹에 추가
    for (let i = 0; i < pieCharts.length; i += 2) {
      const pieGroup = pieCharts.slice(i, i + 2);
      groups.push({ charts: pieGroup, cols: 2 });
    }

    // 남은 다른 차트들 추가
    if (currentGroup.length > 0) {
      groups.push({ charts: currentGroup, cols: currentGroup.length === 2 ? 2 : 3 });
    }

    return groups;
  }, [data]);

  // 지역 차트 클릭 핸들러
  const handleRegionClick = (item: Distribution) => {
    setSelectedRegion(item.label);
  };

  // 세부 지역 차트 닫기
  const handleCloseSubRegion = () => {
    setSelectedRegion(null);
  };

  // 선택된 지역이 있으면 세부 지역 차트 표시
  const filteredSubRegionData = selectedRegion ? getFilteredSubRegionData() : [];

  return (
    <div className="space-y-8">
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
            <TreeMap
              data={filteredSubRegionData}
              title=""
            />
          </div>
        </div>
      )}

      {chartGroups.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={`grid gap-6 md:gap-8 ${
            group.cols === 1
              ? 'grid-cols-1'
              : group.cols === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {group.charts.map((chart) => (
            <div
              key={chart.key}
              className="group relative"
            >
              {/* 상품 카드 스타일 래퍼 */}
              <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                {/* 상단 배지 영역 (선택적) */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
                    <span className="text-xs font-medium text-gray-600">데이터</span>
                  </div>
                </div>
                
                {/* 차트 컨텐츠 */}
                <div className="relative">
                  {chart.type === 'pie' && (
                    <PieChart
                      data={chart.data}
                      title={chart.title}
                      colors={chart.colors}
                    />
                  )}
                  {chart.type === 'bar' && (
                    <BarChart
                      data={chart.data}
                      title={chart.title}
                      scrollable={
                        chart.title.includes('직업') || 
                        chart.title.includes('직무') ||
                        chart.title.includes('가전제품') ||
                        chart.title.includes('보유 휴대폰 브랜드') ||
                        chart.title.includes('보유 휴대폰 모델') ||
                        chart.title.includes('자동차 제조사') ||
                        chart.title.includes('자동차 모델') ||
                        chart.title.includes('담배브랜드') ||
                        chart.title.includes('흡연경험') ||
                        chart.title.includes('음용경험') ||
                        chart.title.includes('술')
                      }
                    />
                  )}
                  {chart.type === 'treemap' && (
                    <TreeMap
                      data={chart.data}
                      title={chart.title}
                      onItemClick={chart.key === 'q_region' ? handleRegionClick : undefined}
                    />
                  )}
                  {chart.type === 'area' && (
                    <AreaChart
                      data={chart.data}
                      title={chart.title}
                      color={chart.colors?.[0] || '#3b82f6'}
                    />
                  )}
                </div>
                
                {/* 하단 정보 바 */}
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
          ))}
        </div>
      ))}
    </div>
  );
};

const SearchPage = () => {
  const { query, setQuery, addSearchHistory, setSearchResults } = useSearch();
  const { mutate, isPending, isSuccess, data, reset } = usePostSearch();
  const navigate = useNavigate();
  const isInitialized = useRef(false);
  const { data: statisticsData, isLoading: isLoadingStatistics } = useGetAllStatistics();

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
      page_size: 30000
    };
    console.log("🔴 SearchPage - 요청 Body:", JSON.stringify(requestBody, null, 2));
    console.log("🔴 SearchPage - page_size 값:", requestBody.page_size);
    mutate(requestBody);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative w-full max-w-full overflow-hidden">
      {/* 좌측에 호버하면 나오는 사이드바 (데스크탑만) */}
      <div className="hidden md:block">
        <Sidebar open={true} />
      </div>

      {/* 검색중이라면 로딩화면 */}
      {isPending ? (
        <Loading />
      ) : (
        // 검색 메인화면 - 스크롤 가능하도록 변경
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          {/* 상단 검색 영역 */}
          <div className="flex flex-col items-center justify-center w-full px-4 md:px-8 lg:px-10 pt-4 md:pt-6 pb-8 md:pb-10 bg-gradient-to-b from-transparent to-white/50 backdrop-blur-sm">
            {/* 검색 메인창 타이틀 */}
            <div className="text-base md:text-lg font-medium text-gray-900 mb-4 md:mb-6 text-center">
              검색하고 싶은 데이터를 자연어로 입력하세요
            </div>

            {/* 검색 폼 */}
            <div className="w-full max-w-2xl">
              <SearchForm
                searchQuery={query}
                setSearchQuery={setQuery}
                onSearch={handleSearch}
                isSearching={isPending}
              />
            </div>

            {/* 예시 검색 키워드 */}
            <div className="mt-3 flex justify-center gap-3">
              <SearchKeywords
                placeholder={example1}
                setKeyword={() => setQuery(example1)}
              />
              <SearchKeywords
                placeholder={example2}
                setKeyword={() => setQuery(example2)}
              />
            </div>

            {/* 모바일 사이드바 (검색 히스토리) */}
            <MobileSidebar />
          </div>

          {/* 전체 패널 데이터 영역 */}
          <div className="w-full max-w-full bg-gray-50/50">
            {/* 섹션 헤더 */}
            <div className="bg-white border-b border-gray-200 py-4 md:py-5 px-4 md:px-6 shadow-sm">
              <div className="max-w-7xl mx-auto">
                <div className="text-sm md:text-base text-gray-600">
                  전체 응답자 수: <span className="text-blue-600 font-bold text-lg md:text-xl">
                    {statisticsData?.total_users?.toLocaleString() || TOTAL_PANEL_COUNT.toLocaleString()}
                  </span> 명
                </div>
              </div>
            </div>

            {/* 차트 그리드 컨테이너 */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
              {isLoadingStatistics ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-gray-500">데이터를 불러오는 중...</div>
                </div>
              ) : statisticsData ? (
                <StatisticsCharts data={statisticsData} />
              ) : (
                <div className="text-center py-20 text-gray-500">데이터가 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
