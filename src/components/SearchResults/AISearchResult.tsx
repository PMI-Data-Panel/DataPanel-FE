import { Download, Star } from "lucide-react";
import type { ResponseSearchPullingDto } from "../../types/search";
import type { MostFrequentValues } from "../../utils/getMostFrequentValues";

interface AISearchResultProps {
  query: string;
  data: ResponseSearchPullingDto;
  mostFrequentValues: MostFrequentValues;
}

const AISearchResult = ({
  query,
  data,
  mostFrequentValues,
}: AISearchResultProps) => {
  // 최빈값을 활용한 요약 문구 생성
  const generateSummary = () => {
    const parts: string[] = [];

    if (mostFrequentValues.age) {
      parts.push(`연령대는 주로 ${mostFrequentValues.age.label}`);
    }

    if (mostFrequentValues.gender) {
      parts.push(
        `성별은 ${mostFrequentValues.gender.label}이 ${mostFrequentValues.gender.value}%`
      );
    }

    if (mostFrequentValues.region) {
      parts.push(`${mostFrequentValues.region.label}에 거주`);
    }

    if (mostFrequentValues.panelSource) {
      parts.push(`설문 출처는 주로 ${mostFrequentValues.panelSource.label}`);
    }

    return parts.length > 0
      ? parts.join(", ") + "입니다."
      : "데이터를 분석 중입니다.";
  };

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
          '{query}'라는 검색어로 총{" "}
          <span className="font-semibold">{data.result.results.length}명</span>
          의 관련 패널을 찾았습니다.
          <br /> {generateSummary()}
        </p>
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
