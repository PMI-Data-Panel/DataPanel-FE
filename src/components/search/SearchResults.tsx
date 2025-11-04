import { useState } from "react";
import { Users, ChevronRight } from "lucide-react";
import RespondentDetail from "./RespondentDetail";
import RespondentCard from "./RespondentCard";

type ResponseSource = {
  user_id: string;
  timestamp: string;
  qa_pairs: Array<{
    q_code: string;
    q_text: string;
    q_type: "SINGLE" | "MULTI";
    answer_text: string | number;
    embedding_text: string;
  }>;
};

interface SearchResultsProps {
  results: ResponseSource[];
  isSearching: boolean;
  searchQuery: string;
}

const SearchResults = ({
  results,
  isSearching,
  searchQuery,
}: SearchResultsProps) => {
  const [selectedRespondent, setSelectedRespondent] =
    useState<ResponseSource | null>(null);

  // 로딩 중
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">검색 중...</p>
      </div>
    );
  }

  // 결과 없음
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Users size={64} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          검색 결과가 없습니다
        </h3>
        <p className="text-gray-500">
          '<span className="font-medium">{searchQuery}</span>' 조건에 맞는
          응답자를 찾을 수 없습니다
        </p>
        <p className="text-sm text-gray-400 mt-2">다른 검색어로 시도해보세요</p>
      </div>
    );
  }

  // 상세 정보 표시
  if (selectedRespondent) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={() => setSelectedRespondent(null)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <ChevronRight className="rotate-180 w-5 h-5 mr-1" />
          <span>목록으로 돌아가기</span>
        </button>
        <RespondentDetail response={selectedRespondent} />
      </div>
    );
  }

  // 결과 목록
  return (
    <div className="mt-8">
      {/* 결과 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">검색 결과</h2>
          <p className="text-gray-600 mt-1">
            '<span className="font-medium text-blue-600">{searchQuery}</span>'
            조건에 맞는{" "}
            <span className="font-semibold">{results.length}명</span>의 응답자를
            찾았습니다
          </p>
        </div>
      </div>

      {/* 결과 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((response, index) => (
          <RespondentCard
            key={response.user_id}
            response={response}
            index={index}
            onClick={() => setSelectedRespondent(response)}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
