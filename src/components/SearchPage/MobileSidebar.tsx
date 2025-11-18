import { useSearch } from "../../hooks/useSearch";
import SearchHistory from "./SearchHistory";

const MobileSidebar = () => {
  const { searchHistory } = useSearch();

  return (
    <div className="w-full max-w-2xl mt-6 md:hidden">
      {/* 검색 히스토리 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">최근 검색</h3>
        {searchHistory.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            이전 검색 히스토리가 없습니다.
          </p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchHistory.slice(0, 5).map((item) => (
              <SearchHistory key={item.id} query={item.query} data={item} />
            ))}
          </div>
        )}
      </div>

      {/* 저장된 그룹 (나중에 구현하면 넣기) */}
    </div>
  );
};

export default MobileSidebar;
