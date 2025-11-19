import { Download, Star } from "lucide-react";
import type { ResponseSearchNlDto } from "../../types/search";
import SimpleBarChart from "../common/graph/SimpleBarChart";
import { TOTAL_PANEL_COUNT } from "../../constants/number";

interface AISearchResultProps {
  query: string;
  data: ResponseSearchNlDto;
}

const AISearchResult = ({ query, data }: AISearchResultProps) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 w-full max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            AI 분석 요약
          </h2>
        </div>

        <SimpleBarChart
          title="전체 db에서 매칭된 데이터"
          matchedValue={data.total_hits}
          totalValue={TOTAL_PANEL_COUNT}
        />

        <div className="space-y-3 md:space-y-5">
          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
            <span className="text-xl font-semibold">'{query}'</span>라는
            검색어로 총{" "}
            <span className="text-xl font-semibold text-blue-500">
              {data.requested_count !== 1000
                ? data.requested_count
                : data.total_hits}
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

          <div className="grid grid-cols-2 gap-5 p-3">
            {/* 이 그룹 저장하기 (히스토리) */}
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
      </div>
    </>
  );
};

export default AISearchResult;
