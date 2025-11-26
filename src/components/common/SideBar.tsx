import { Search } from "lucide-react";

// 카테고리 타입 정의
export type CategoryType =
  | "demographics"
  | "region"
  | "education"
  | "income"
  | "lifestyle"
  | "consumption";

interface Category {
  id: CategoryType;
  name: string;
  icon: string;
}

const CATEGORIES: Category[] = [
  { id: "demographics", name: "인구통계", icon: "👥" },
  { id: "region", name: "지역정보", icon: "📍" },
  { id: "education", name: "교육/직업", icon: "🎓" },
  { id: "income", name: "소득", icon: "💰" },
  { id: "lifestyle", name: "생활패턴", icon: "🚬" },
  { id: "consumption", name: "소비/보유", icon: "🛒" },
];

interface SideBarProps {
  isOpen: boolean;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
  totalUsers: number;
  selectedCategory: CategoryType | null;
  setSelectedCategory: (category: CategoryType | null) => void;
  getCategoryChartCount: (categoryId: CategoryType) => number;
}

const SideBar = ({
  isOpen,
  categoryFilter,
  setCategoryFilter,
  totalUsers,
  selectedCategory,
  setSelectedCategory,
  getCategoryChartCount,
}: SideBarProps) => {
  return (
    <div
      className={`bg-white flex flex-col overflow-hidden relative transition-all duration-300 ease-in-out lg:border-r border-gray-200 rounded-lg lg:rounded-none ${
        isOpen ? "w-full lg:w-80" : "w-0 lg:w-0"
      }`}
    >
      <div
        className="h-full flex flex-col w-full lg:w-80"
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 300ms ease-in-out",
        }}
      >
        {/* 검색/필터 섹션 */}
        <div className="px-3 py-5 bg-white shrink-0">
          <p className="font-black text-black mt-3">전체 통계에서 검색하기</p>

          <div className="relative py-2">
            <input
              type="text"
              placeholder="전체 통계 그래프에서 키워드 검색"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* 전체 응답자 수 */}
        <div className="px-4 shrink-0">
          <div className="text-sm text-gray-600">
            전체 응답자 수:{" "}
            <span className="text-blue-600 font-bold text-base">
              {totalUsers.toLocaleString()}
            </span>
            &nbsp;명
          </div>
        </div>

        {/* 카테고리 목록 */}
        <div className="flex-1 overflow-y-auto px-3 pt-3 pb-3">
          {CATEGORIES.map((category, index) => {
            const chartCount = getCategoryChartCount(category.id);
            const isSelected = selectedCategory === category.id;

            return (
              <div key={category.id}>
                <button
                  onClick={() =>
                    setSelectedCategory(isSelected ? null : category.id)
                  }
                  className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white border-2 border-transparent hover:bg-blue-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {category.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {chartCount}개 차트
                      </div>
                    </div>
                  </div>
                </button>
                {index < CATEGORIES.length - 1 && (
                  <div className="h-px bg-gray-200 mx-4"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
