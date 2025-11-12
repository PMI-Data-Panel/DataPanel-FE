import { SidebarClose, SidebarOpen } from "lucide-react";
import { useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import SearchHistory from "./SearchHistory";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { searchHistory } = useSearch();

  return (
    <>
      {/* 호버 트리거 영역 (좌측 가장자리) - 사이드바가 닫혀있을 때만 */}
      {!isHovered && (
        <div
          className="absolute left-0 top-0 bottom-0 w-12 z-30"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`min-h-screen bg-white border-r border-gray-200 shadow-lg transition-all duration-600 ease-in-out ${
          isHovered ? "w-60" : "w-0"
        }`}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!isHovered && (
          <SidebarOpen className="bg-gray-50 w-8 text-gray-400 mt-5 ml-3" />
        )}
        {isHovered && (
          <SidebarClose className="bg-white w-8 text-gray-400 mt-5 ml-3" />
        )}

        <div
          className={`grid grid-rows-2 h-full p-6 ${
            isHovered ? "opacity-100" : "opacity-0"
          } transition-opacity duration-600`}
        >
          {/* 검색 히스토리 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 whitespace-nowrap">
              검색 히스토리
            </h3>
            {searchHistory.length === 0 ? (
              <p className="text-sm text-gray-500 whitespace-nowrap">
                이전 검색 히스토리가 없습니다.
              </p>
            ) : (
              <ul className="space-y-2">
                {searchHistory.map((item) => (
                  <SearchHistory key={item.id} query={item.query} data={item} />
                ))}
              </ul>
            )}
          </div>

          {/* 저장된 그룹 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 whitespace-nowrap">
              저장된 그룹
            </h3>
            <p className="text-sm text-gray-500 whitespace-nowrap">
              저장된 그룹이 없습니다.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
