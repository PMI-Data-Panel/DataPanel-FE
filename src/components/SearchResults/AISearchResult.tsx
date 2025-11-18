import { Download, Star } from "lucide-react";
import type { ResponseSearchNlDto } from "../../types/search";

interface AISearchResultProps {
  query: string;
  data: ResponseSearchNlDto;
}

const AISearchResult = ({ query, data }: AISearchResultProps) => {
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">AI 분석 요약</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2">
              <Star className="w-4 h-4" />이 그룹 저장하기
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              CSV로 내보내기
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            '{query}'라는 검색어로 총{" "}
            <span className="font-semibold">
              {data.requested_count !== 1000
                ? data.requested_count
                : data.results.length}
              명
            </span>
            의 관련 패널을 찾았습니다.
          </p>

          {/* Behavioral Summary */}
          {data.llm_summary?.summary?.behavioral_summary && (
            <p className="text-gray-700 leading-relaxed">
              {data.llm_summary.summary.behavioral_summary}
            </p>
          )}

          {/* Highlights - 불렛 리스트 */}
          {data.llm_summary?.summary?.highlights &&
            data.llm_summary.summary.highlights.length > 0 && (
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {data.llm_summary.summary.highlights.map((highlight, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
        </div>

        <div className="mt-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            분석 완료
          </span>
        </div>
      </div>
    </>
  );
};

export default AISearchResult;
