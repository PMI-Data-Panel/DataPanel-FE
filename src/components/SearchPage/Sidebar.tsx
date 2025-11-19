import { SidebarClose, SidebarOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import SearchHistory from "./SearchHistory";

interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  const [isSidebarOpen, setIsOpen] = useState(true);
  const { searchHistory } = useSearch();

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <>
      {/* 사이드바가 닫혀있을 때 열기 버튼 */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute left-3 top-5 z-30 p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <SidebarOpen className="w-6 h-6 text-gray-400" />
        </button>
      )}

      {/* 사이드바 */}
      <div
        className={`h-screen sticky top-0 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? "w-60" : "w-0"
        }`}
      >
        {isSidebarOpen && (
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors mt-5 ml-3"
          >
            <SidebarClose className="w-6 h-6 text-gray-400" />
          </button>
        )}

        <div
          className={`grid grid-rows-2 h-full p-6 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          } transition-opacity duration-300`}
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
        </div>
      </div>
    </>
  );
};

export default Sidebar;
