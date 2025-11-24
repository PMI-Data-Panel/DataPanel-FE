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
      <div className="bg-white rounded-xl shadow-sm p-4 md:p-5 w-full max-w-full overflow-hidden h-full">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#191f28]">
            AI 분석 요약
          </h2>
        </div>

        <SimpleBarChart
          title="전체 db에서 매칭된 데이터"
          matchedValue={data.total_hits}
          totalValue={TOTAL_PANEL_COUNT}
        />

        <div className="space-y-4 md:space-y-5 mt-4">
          <div className="bg-[#f5f6f8] rounded-lg p-4 md:p-4">
            <p className="text-sm md:text-base text-[#191f28] leading-relaxed">
              <span className="font-bold text-[#191f28]">'{query}'</span>라는
              검색어로 총{" "}
              <span className="font-bold text-[#3182f6]">
                {data.requested_count !== 1000
                  ? data.requested_count
                  : data.total_hits}
                명
              </span>
              의 관련 패널을 찾았습니다.
            </p>
          </div>

          {/* Behavioral Summary */}
          {data.llm_summary?.summary?.behavioral_summary && (
            <div className="bg-white border border-gray-100 rounded-lg p-4 md:p-4">
              <p className="text-xs md:text-sm text-[#4e5968] leading-relaxed">
                {data.llm_summary.summary.behavioral_summary}
              </p>
            </div>
          )}

          {/* Highlights - 불렛 리스트 */}
          {data.llm_summary?.summary?.highlights &&
            data.llm_summary.summary.highlights.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-lg p-4 md:p-4">
                <h3 className="text-xs md:text-sm font-semibold text-[#191f28] mb-3">주요 하이라이트</h3>
                <ul className="space-y-2 text-xs md:text-sm text-[#4e5968]">
                  {data.llm_summary.summary.highlights.map((highlight, idx) => (
                    <li key={idx} className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#3182f6] mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default AISearchResult;
