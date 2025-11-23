import { useSearch } from "../../hooks/useSearch";
import SearchHistory from "./SearchHistory";

const MobileSidebar = () => {
  const { searchHistory } = useSearch();

  return (
    <div className="w-full max-w-2xl mt-6 md:hidden">
      {/* 검색 히스토리 */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-bold text-[#191f28] mb-4">최근 검색</h3>
        {searchHistory.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-[#8b95a1] text-center">
              이전 검색 히스토리가 없습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {searchHistory.slice(0, 10).map((item) => (
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
