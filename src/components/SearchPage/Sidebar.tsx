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
        className={`h-screen sticky top-0 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0"
        } flex flex-col overflow-hidden`}
      >
        {isSidebarOpen && (
          <>
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
              <h3 className="text-lg font-bold text-[#191f28]">검색 히스토리</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-[#f5f6f8] rounded-xl transition-colors"
              >
                <SidebarClose className="w-5 h-5 text-[#8b95a1]" />
              </button>
            </div>

            {/* 검색 히스토리 리스트 - 스크롤 가능 */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {searchHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-[#8b95a1] text-center">
                    이전 검색 히스토리가 없습니다.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {searchHistory.map((item) => (
                    <SearchHistory key={item.id} query={item.query} data={item} />
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
