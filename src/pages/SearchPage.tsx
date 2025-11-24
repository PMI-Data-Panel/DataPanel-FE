import { useSearch } from "../hooks/useSearch";
import usePostSearch from "../hooks/queries/usePostSearch";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Loading from "../components/SearchPage/Loading";
import AreaChart from "../components/common/graph/AreaChart";
import BarChart from "../components/common/graph/BarChart";
import PieChart from "../components/common/graph/PieChart";
import TreeMap from "../components/common/graph/TreeMap";
import { TOTAL_PANEL_COUNT } from "../constants/number";
import { useGetAllStatistics } from "../hooks/queries/useGetVisualization";
import type { AllStatisticsResponse, Distribution } from "../types/search";
import { useMemo, useState } from "react";
import { Search, Send, Menu, X } from "lucide-react";


// 카테고리 타입 정의
type CategoryType = 'demographics' | 'region' | 'education' | 'income' | 'lifestyle' | 'consumption';

interface Category {
  id: CategoryType;
  name: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: 'demographics', name: '인구통계', icon: '👥' },
  { id: 'region', name: '지역정보', icon: '📍' },
  { id: 'education', name: '교육/직업', icon: '🎓' },
  { id: 'income', name: '소득', icon: '💰' },
  { id: 'lifestyle', name: '생활패턴', icon: '🚬' },
  { id: 'consumption', name: '소비/보유', icon: '🛒' },
];

// StatisticsCharts 컴포넌트
const StatisticsCharts = ({ 
  data, 
  selectedCategory,
  categoryFilter 
}: { 
  data: AllStatisticsResponse;
  selectedCategory: CategoryType | null;
  categoryFilter: string;
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // 데이터를 Distribution 형식으로 변환
  const convertToDistribution = (
    answerDistribution: Array<{ answer: string; count: number; percentage: number }>,
    sortByNumber = false
  ): Distribution[] => {
    const distribution = answerDistribution.map(item => {
      let label = item.answer;
      // 모든 차트에서 괄호와 그 안의 내용 제거 (여러 번 실행하여 중첩된 괄호도 제거)
      while (label.includes('(') || label.includes(')')) {
        label = label.replace(/\([^()]*\)/g, '').trim();
        // 불완전한 괄호도 제거 (여는 괄호만 있거나 닫는 괄호만 있는 경우)
        label = label.replace(/\([^)]*$/g, '').trim();
        label = label.replace(/^[^(]*\)/g, '').trim();
      }
      // 연속된 공백을 하나로 정리
      label = label.replace(/\s+/g, ' ').trim();
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


  // 차트를 카테고리별로 분류
  const categorizedCharts = useMemo(() => {
    type ChartItem = {
        key: string;
        title: string;
        data: Distribution[];
        type: 'pie' | 'bar' | 'treemap' | 'area';
        colors?: string[];
    };

    type ChartGroup = {
      charts: ChartItem[];
      cols: number;
    };

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
      const distribution = convertToDistribution(stat.answer_distribution, key === 'q_birth_year');
      const answerCount = distribution.length;
      const desc = stat.question_description;

      // 차트 타입 결정
      let chartType: 'pie' | 'bar' | 'treemap' | 'area' = 'pie';
      let colors: string[] | undefined;

      if (key === 'q_region' || key === 'q_sub_region') {
        chartType = 'bar';
      } else if (desc.includes('흡연경험') || desc.includes('최종학력')) {
        chartType = 'bar';
      } else if (key === 'q_personal_income' || key === 'q_household_income' || key === 'q_birth_year') {
        chartType = 'area';
        colors = ['#3b82f6'];
      } else if (key === 'q_age' || key === 'q_family_count' || key === 'q_children_count') {
        chartType = 'bar';
      } else if (answerCount > 10) {
        chartType = 'bar';
      } else if (answerCount <= 3) {
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

      const chartItem: ChartItem = {
        key,
        title: desc,
            data: distribution,
            type: chartType,
            colors,
      };

      // 카테고리 분류
      if (key === 'q_gender' || key === 'q_age' || key === 'q_birth_year' || 
          key === 'q_marriage' || key === 'q_family_count' || key === 'q_children_count') {
        categories.demographics.push(chartItem);
      } else if (key === 'q_region' || key === 'q_sub_region') {
        categories.region.push(chartItem);
      } else if (desc.includes('최종학력') || desc.includes('직업') || desc.includes('직무')) {
        categories.education.push(chartItem);
      } else if (key === 'q_personal_income' || key === 'q_household_income') {
        categories.income.push(chartItem);
      } else if (desc.includes('흡연경험') || desc.includes('음용경험') || desc.includes('술') || desc.includes('담배브랜드')) {
        categories.lifestyle.push(chartItem);
      } else if (desc.includes('가전제품') || desc.includes('보유 휴대폰') || 
                 desc.includes('자동차') || key === 'q_car_owned') {
        categories.consumption.push(chartItem);
      } else {
        // 기본적으로 인구통계에 포함
        categories.demographics.push(chartItem);
      }
    });

    // 각 카테고리의 차트들을 그룹화
    const categoryGroups: Record<CategoryType, ChartGroup[]> = {
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
      if (category === 'region') {
        if (charts.length > 0) {
          categoryGroups[category].push({ charts, cols: 2 });
        }
      }
      // 교육/직업: 직업/직무는 2개씩, 최종학력은 별도
      else if (category === 'education') {
        const jobCharts = charts.filter(c => c.title.includes('직업') || c.title.includes('직무'));
        const educationCharts = charts.filter(c => c.title.includes('최종학력'));
        
        if (jobCharts.length > 0) {
          categoryGroups[category].push({ charts: jobCharts, cols: 2 });
        }
        educationCharts.forEach(chart => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
      // 소득: 각각 1개씩
      else if (category === 'income') {
        charts.forEach(chart => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
      // 생활패턴: 흡연경험과 기타를 분리
      else if (category === 'lifestyle') {
        const smokerCharts = charts.filter(c => c.title.includes('흡연경험'));
        const otherCharts = charts.filter(c => !c.title.includes('흡연경험'));
        
        if (smokerCharts.length > 0) {
          categoryGroups[category].push({ charts: smokerCharts, cols: 1 });
        }
        otherCharts.forEach(chart => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
      // 소비/보유: 가족수/자녀수는 2개씩, 나머지는 1개씩
      else if (category === 'consumption') {
        const familyCharts = charts.filter(c => c.title.includes('가족수') || c.title.includes('자녀수'));
        const otherCharts = charts.filter(c => !c.title.includes('가족수') && !c.title.includes('자녀수'));
        
        if (familyCharts.length > 0) {
          categoryGroups[category].push({ charts: familyCharts, cols: 2 });
        }
        // 제품 관련 차트들을 2개씩 묶기
        const productCharts = otherCharts.filter(c => 
          c.title.includes('가전제품') || 
          c.title.includes('보유 휴대폰') || 
          c.title.includes('자동차')
        );
        const restCharts = otherCharts.filter(c => 
          !c.title.includes('가전제품') && 
          !c.title.includes('보유 휴대폰') && 
          !c.title.includes('자동차')
        );
        
        if (productCharts.length > 0) {
          for (let i = 0; i < productCharts.length; i += 2) {
            categoryGroups[category].push({ 
              charts: productCharts.slice(i, i + 2), 
              cols: 2 
            });
          }
        }
        restCharts.forEach(chart => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
      }
      // 인구통계: 파이차트는 2개씩, 나머지는 1개씩
      else {
        const pieCharts = charts.filter(c => c.type === 'pie');
        const barCharts = charts.filter(c => c.type === 'bar');
        const areaCharts = charts.filter(c => c.type === 'area');
        
        // 파이차트 2개씩 묶기
    for (let i = 0; i < pieCharts.length; i += 2) {
          categoryGroups[category].push({ 
            charts: pieCharts.slice(i, i + 2), 
            cols: 2 
          });
        }
        
        // 가족수/자녀수는 2개씩
        const familyCharts = barCharts.filter(c => 
          c.title.includes('가족수') || c.title.includes('자녀수')
        );
        const otherBarCharts = barCharts.filter(c => 
          !c.title.includes('가족수') && !c.title.includes('자녀수')
        );
        
        if (familyCharts.length > 0) {
          categoryGroups[category].push({ charts: familyCharts, cols: 2 });
        }
        
        otherBarCharts.forEach(chart => {
          categoryGroups[category].push({ charts: [chart], cols: 1 });
        });
        
        // Area 차트는 각각 1개씩
        areaCharts.forEach(chart => {
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

  // 선택된 지역이 있으면 세부 지역 차트 표시
  const filteredSubRegionData = selectedRegion ? getFilteredSubRegionData() : [];

  // 차트 렌더링 헬퍼 함수
  const renderChart = (chart: {
    key: string;
    title: string;
    data: Distribution[];
    type: 'pie' | 'bar' | 'treemap' | 'area';
    colors?: string[];
  }) => {
    return (
      <div key={chart.key} className="group relative">
        <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="absolute top-3 right-3 z-10">
            <div className="px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
              <span className="text-xs font-medium text-gray-600">데이터</span>
            </div>
          </div>
          
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
                onBarClick={chart.key === 'q_region' ? handleRegionClick : undefined}
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
                  chart.title.includes('술') ||
                  chart.title.includes('지역') ||
                  chart.key === 'q_region' ||
                  chart.key === 'q_sub_region'
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

  // 필터링된 차트 그룹 가져오기
  const getFilteredGroups = () => {
    if (!selectedCategory) return [];
    
    let groups = categorizedCharts[selectedCategory];
    
    // 필터 적용
    if (categoryFilter.trim()) {
      groups = groups.map(group => ({
        ...group,
        charts: group.charts.filter(chart => 
          chart.title.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      })).filter(group => group.charts.length > 0);
    }
    
    return groups;
  };

  const filteredGroups = getFilteredGroups();

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
            <TreeMap
              data={filteredSubRegionData}
              title=""
            />
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
              ? 'grid-cols-1'
              : group.cols === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
            {group.charts.map(renderChart)}
                  </div>
        ))
      ) : selectedCategory ? (
        <div className="text-center py-20 font-bold text-black">
          {categoryFilter.trim() ? '필터 조건에 맞는 차트가 없습니다.' : '차트가 없습니다.'}
                </div>
      ) : (
        <div className="text-center py-20 font-bold text-black">
          왼쪽에서 카테고리를 선택해주세요.
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
  const { data: statisticsData, isLoading: isLoadingStatistics } = useGetAllStatistics();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

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

  // 카테고리별 차트 개수 계산
  const getCategoryChartCount = useMemo(() => {
    if (!statisticsData) return () => 0;
    
    const counts: Record<CategoryType, number> = {
      demographics: 0,
      region: 0,
      education: 0,
      income: 0,
      lifestyle: 0,
      consumption: 0,
    };

    const statistics = statisticsData.statistics;
    const keys = Object.keys(statistics);

    keys.forEach((key) => {
      const stat = statistics[key];
      const desc = stat.question_description;

      if (key === 'q_gender' || key === 'q_age' || key === 'q_birth_year' || 
          key === 'q_marriage' || key === 'q_family_count' || key === 'q_children_count') {
        counts.demographics++;
      } else if (key === 'q_region' || key === 'q_sub_region') {
        counts.region++;
      } else if (desc.includes('최종학력') || desc.includes('직업') || desc.includes('직무')) {
        counts.education++;
      } else if (key === 'q_personal_income' || key === 'q_household_income') {
        counts.income++;
      } else if (desc.includes('흡연경험') || desc.includes('음용경험') || desc.includes('술') || desc.includes('담배브랜드')) {
        counts.lifestyle++;
      } else if (desc.includes('가전제품') || desc.includes('보유 휴대폰') || 
                 desc.includes('자동차') || key === 'q_car_owned') {
        counts.consumption++;
      } else {
        counts.demographics++;
      }
    });

    return (categoryId: CategoryType) => counts[categoryId];
  }, [statisticsData]);

  return (
    <div className="flex h-screen bg-white relative w-full max-w-full overflow-hidden">
      {/* 사이드바 토글 버튼 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-16 left-4 z-50 p-2 rounded-lg shadow-md hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center"
        style={{ backgroundColor: '#2DC5F4' }}
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* 왼쪽 사이드바 - 카테고리 목록 */}
      <div 
        className="bg-white flex flex-col overflow-hidden relative transition-all duration-300 ease-in-out"
        style={{ 
          width: isSidebarOpen ? '256px' : '0px',
          marginTop: '-48px',
          paddingTop: '48px',
          minWidth: isSidebarOpen ? '256px' : '0px',
          maxWidth: isSidebarOpen ? '256px' : '0px'
        }}
      >
        <div 
          className="h-full transition-opacity duration-300"
          style={{
            opacity: isSidebarOpen ? 1 : 0,
            pointerEvents: isSidebarOpen ? 'auto' : 'none',
            visibility: isSidebarOpen ? 'visible' : 'hidden'
          }}
        >
            {/* 타이틀 - 파란색 그라데이션 헤더 */}
        <div 
          className="px-4 py-3 relative"
          style={{
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)',
            minHeight: '100px',
            paddingBottom: '30px',
            overflow: 'visible',
            background: '#2E77BE',
          }}
        >
          {/* 텍스트 컨텐츠 */}
          <div className="relative z-10" style={{ paddingLeft: '60px' }}>
            <h1 className="text-xl font-bold text-white mb-0">패널</h1>
            <h1 className="text-xl font-bold text-white mb-0.5">인사이트</h1>
            <p className="text-xs text-white">Panel Insights</p>
          </div>
        </div>

        {/* 검색/필터 섹션 */}
        <div className="px-4 pt-1 pb-2 bg-white">
          <p className="font-black text-black mb-1" style={{ fontSize: '19px' }}>
            검색어가 고민되시나요?
          </p>
          <p className="text-sm text-gray-700 mb-2">
            클릭 한번으로 아이디어 GET
          </p>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* 전체 응답자 수 */}
        <div className="px-4 py-1">
          <div className="text-sm text-gray-600">
            전체 응답자 수: <span className="text-blue-600 font-bold text-base">
              {statisticsData?.total_users?.toLocaleString() || TOTAL_PANEL_COUNT.toLocaleString()}
            </span> 명
          </div>
        </div>

        {/* 카테고리 목록 */}
        <div className="flex-1 overflow-y-auto px-3 py-1">
          {CATEGORIES.map((category, index) => {
            const chartCount = getCategoryChartCount(category.id);
            const isSelected = selectedCategory === category.id;
            
            return (
              <div key={category.id}>
                <button
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  className={`w-full px-4 py-3 mb-2 rounded-lg text-left transition-colors ${
                    isSelected 
                      ? 'bg-blue-100 border-2 border-blue-500' 
                      : 'bg-white border-2 border-transparent hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{category.name}</div>
                      <div className="text-xs text-gray-500">{chartCount}개 차트</div>
                    </div>
                  </div>
                </button>
                {index < CATEGORIES.length - 1 && (
                  <div className="h-px bg-gray-200 mx-4 mb-2"></div>
                )}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* 오른쪽 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col overflow-hidden">
      {/* 검색중이라면 로딩화면 */}
      {isPending ? (
        <Loading />
      ) : (
          <div className="flex-1 overflow-y-auto bg-white">
            {/* 검색 바 섹션 */}
            <div className="px-6 py-8 md:px-10 md:py-12">
              {/* 상단 안내 텍스트 */}
              <div className="mb-6 text-center">
                <p className="text-lg md:text-xl text-gray-700">
                  검색하고 싶은 데이터를{" "}
                  <span className="font-black" style={{ color: '#2DC2F2', fontWeight: 950, letterSpacing: '-0.02em' }}>자연어로</span> 입력하세요
                </p>
              </div>

              {/* 검색 입력 필드 */}
              <div className="relative mb-6 max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#2DC2F2' }} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && query.trim()) {
                      handleSearch(query);
                    }
                  }}
                  placeholder="어떤 패널을 추출해드릴까요?"
                  className="w-full pl-12 pr-14 py-4 text-base border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 bg-white"
                  style={{
                    borderColor: '#2DC2F2',
                    boxShadow: '0 10px 15px -3px rgba(45, 194, 242, 0.1), 0 4px 6px -2px rgba(45, 194, 242, 0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#2DC2F2';
                    e.target.style.boxShadow = '0 0 0 4px rgba(45, 194, 242, 0.1), 0 10px 15px -3px rgba(45, 194, 242, 0.1), 0 4px 6px -2px rgba(45, 194, 242, 0.05)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#2DC2F2';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(45, 194, 242, 0.1), 0 4px 6px -2px rgba(45, 194, 242, 0.05)';
                  }}
                />
                <button
                  onClick={() => query.trim() && handleSearch(query)}
                  disabled={!query.trim() || isPending}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white p-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#2DC2F2',
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = '#1ea8d9';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = '#2DC2F2';
                    }
                  }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              {/* 제안 검색어 */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => {
                    const suggestion = "서울에 사는 ott 구독자";
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  className="px-4 py-2 text-sm font-black border rounded-lg transition-colors duration-200"
                  style={{ 
                    color: '#2DC2F2',
                    borderRadius: '100px',
                    borderColor: '#2DC2F2',
                    fontWeight: 950,
                    letterSpacing: '-0.02em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(45, 194, 242, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  서울에 사는 ott 구독자
                </button>
                <button
                  onClick={() => {
                    const suggestion = "술담배 좋아하는 30대";
                    setQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                  className="px-4 py-2 text-sm font-black border rounded-lg transition-colors duration-200"
                  style={{ 
                    color: '#2DC2F2',
                    borderRadius: '100px',
                    borderColor: '#2DC2F2',
                    fontWeight: 950,
                    letterSpacing: '-0.02em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(45, 194, 242, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  술담배 좋아하는 30대
                </button>
              </div>
            </div>

            {/* 차트 영역 */}
            <div className="p-6 bg-white">
              {isLoadingStatistics ? (
                <div className="flex items-center justify-center py-20">
                  <div className="font-bold text-black">데이터를 불러오는 중...</div>
                </div>
              ) : statisticsData ? (
                <StatisticsCharts 
                  data={statisticsData} 
                  selectedCategory={selectedCategory}
                  categoryFilter={categoryFilter}
                />
              ) : (
                <div className="text-center py-20 font-bold text-black">데이터가 없습니다.</div>
              )}
            </div>
          </div>
        )}
        </div>
    </div>
  );
};

export default SearchPage;
