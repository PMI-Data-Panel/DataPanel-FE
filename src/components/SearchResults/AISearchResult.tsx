import { Download, Star } from "lucide-react";
import type { ResponseSearchNlDto } from "../../types/search";

interface AISearchResultProps {
  query: string;
  data: ResponseSearchNlDto;
}

const AISearchResult = ({ query, data }: AISearchResultProps) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 w-full max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            AI 분석 요약
          </h2>
          <div className="grid grid-cols-2 gap-5 p-3">
            {/* 이 그룹 저장하기 */}
            <button className="px-3 py-2 md:px-4 md:py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 text-sm md:text-base flex-shrink-0">
              <Star className="w-4 h-4" />
              <span className="whitespace-nowrap">이 그룹 저장하기</span>
            </button>
            {/* csv로 내보내기 */}
            <button className="px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base flex-shrink-0">
              <Download className="w-4 h-4" />
              <span className="whitespace-nowrap">CSV로 내보내기</span>
            </button>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            '{query}'라는 검색어로 총{" "}
            <span className="font-semibold">
              {data.total_hits >= 1000 ? data.total_hits : data.requested_count}
              명
            </span>
            의 관련 패널을 찾았습니다.
          </p>

          {/* Behavioral Summary */}
          {data.llm_summary?.summary?.behavioral_summary && (
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {data.llm_summary.summary.behavioral_summary}
            </p>
          )}

          {/* Highlights - 불렛 리스트 */}
          {data.llm_summary?.summary?.highlights &&
            data.llm_summary.summary.highlights.length > 0 && (
              <ul className="list-disc list-inside space-y-1.5 md:space-y-2 text-sm md:text-base text-gray-700 pl-1">
                {data.llm_summary.summary.highlights.map((highlight, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
        </div>

        <div className="mt-3 md:mt-4">
          <span className="inline-block px-2.5 py-1 md:px-3 md:py-1 bg-blue-100 text-blue-800 rounded-full text-xs md:text-sm font-medium">
            분석 완료
          </span>
        </div>
      </div>
    </>
  );
};

export default AISearchResult;
