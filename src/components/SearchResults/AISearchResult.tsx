import { Download, Star } from "lucide-react";
import type { ResponseSearchPullingDto } from "../../types/search";

interface AISearchResultProps {
  query: string;
  data: ResponseSearchPullingDto;
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
        <p className="text-gray-700 leading-relaxed">
          '{query}' 조건으로 총{" "}
          <span className="font-semibold">{data.result.results.length}명</span>
          의 관련 패널을 찾았습니다. 이들의 연령대는 주로 ...대이고 ...에 살며
          ... 의 직업을.........
        </p>
        <div className="mt-4">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            (ㅇ)
          </span>
        </div>
      </div>
    </>
  );
};

export default AISearchResult;
