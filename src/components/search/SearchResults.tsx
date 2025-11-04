import { useState, useEffect, useRef } from "react";
import { Users, ChevronRight } from "lucide-react";
import RespondentCard from "./RespondentCard";
import RespondentDetail from "./RespondentDetail";

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

const ITEMS_PER_PAGE = 9; // 한 번에 보여줄 카드 개수

const SearchResults = ({
  results,
  isSearching,
  searchQuery,
}: SearchResultsProps) => {
  const [selectedRespondent, setSelectedRespondent] =
    useState<ResponseSource | null>(null);
  const [displayedResults, setDisplayedResults] = useState<ResponseSource[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 검색 결과가 변경되면 초기화
  useEffect(() => {
    setDisplayedResults(results.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(results.length > ITEMS_PER_PAGE);
  }, [results]);

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || selectedRespondent) return;

    const el = loadMoreRef.current;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];

      if (first.isIntersecting && hasMore) {
        loadMore();
      }
    });

    observer.observe(el);

    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [hasMore, page, selectedRespondent]);

  // 더 많은 결과 로드
  const loadMore = () => {
    const nextPage = page + 1;
    const startIndex = 0;
    const endIndex = nextPage * ITEMS_PER_PAGE;

    const newDisplayedResults = results.slice(startIndex, endIndex);
    setDisplayedResults(newDisplayedResults);
    setPage(nextPage);

    // 더 이상 로드할 데이터가 없는지 확인
    if (endIndex >= results.length) {
      setHasMore(false);
    }
  };

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
      <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
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
    <div className="mb-10">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {displayedResults.map((response, index) => (
          <RespondentCard
            key={response.user_id}
            response={response}
            index={index}
            onClick={() => setSelectedRespondent(response)}
          />
        ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* 모든 결과 로드 완료 */}
      {!hasMore && displayedResults.length > 0 && (
        <div className="text-center mt-8 py-8">
          <p className="text-gray-500">
            모든 결과를 불러왔습니다 ({displayedResults.length}명)
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
