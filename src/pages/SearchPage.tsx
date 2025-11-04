import { useState } from "react";
import Button from "../components/common/Button";
import LandingText from "../components/common/LandingText";
import SearchForm from "../components/search/SearchForm";
import SearchResults from "../components/search/SearchResults";
import {
  mockSurveyData,
  filterResponses,
  getSingleAnswer,
} from "../utils/mockDataUtils";

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

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ResponseSource[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  /**
   * 검색어를 기반으로 목데이터를 필터링하는 함수
   * 실제로는 백엔드 API를 호출할 예정
   */
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // API 호출 시뮬레이션 (1초 딜레이)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // 검색어에서 키워드 추출 (간단한 예시)
      const results = performMockSearch(query);
      setSearchResults(results);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * 목데이터에서 검색을 수행하는 함수
   * 실제로는 백엔드 Elasticsearch 쿼리로 대체될 예정
   */
  const performMockSearch = (query: string): ResponseSource[] => {
    const lowerQuery = query.toLowerCase();

    // 검색 조건 매핑
    const conditions: {
      [key: string]: (response: ResponseSource) => boolean;
    } = {
      미혼: (r) => getSingleAnswer(r, "Q1") === "미혼",
      기혼: (r) => getSingleAnswer(r, "Q1") === "기혼",
      전문직: (r) => {
        const occupation = getSingleAnswer(r, "Q5");
        return typeof occupation === "string" && occupation.includes("전문직");
      },
      대졸: (r) => {
        const edu = getSingleAnswer(r, "Q4");
        return typeof edu === "string" && edu.includes("대학");
      },
      대학원: (r) => {
        const edu = getSingleAnswer(r, "Q4");
        return typeof edu === "string" && edu.includes("대학원");
      },
      차량보유: (r) => getSingleAnswer(r, "Q10") === "있다",
      "차량 보유": (r) => getSingleAnswer(r, "Q10") === "있다",
      "1인가구": (r) => {
        const family = getSingleAnswer(r, "Q3");
        return typeof family === "string" && family.includes("1명");
      },
      혼자: (r) => {
        const family = getSingleAnswer(r, "Q3");
        return typeof family === "string" && family.includes("혼자");
      },
    };

    // 적용할 필터 찾기
    const activeFilters: Array<(r: ResponseSource) => boolean> = [];

    Object.keys(conditions).forEach((keyword) => {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        activeFilters.push(conditions[keyword]);
      }
    });

    // 필터가 없으면 전체 결과 반환
    if (activeFilters.length === 0) {
      return filterResponses(mockSurveyData, () => true);
    }

    // 모든 조건을 만족하는 응답자 필터링
    return filterResponses(mockSurveyData, (response) => {
      return activeFilters.every((filter) => filter(response));
    });
  };

  /**
   * 예시 검색어 클릭 핸들러
   */
  const handleExampleClick = (exampleQuery: string) => {
    setSearchQuery(exampleQuery);
    handleSearch(exampleQuery);
  };

  return (
    <div className="flex flex-col p-10 mt-10 gap-10 pb-20">
      {/* 헤더 텍스트 */}
      <LandingText
        titleText1="실제 사람들에게서"
        titleTextSpan="새로운 인사이트"
        titleTextBack="를 발견하세요"
        subText1="포괄적인 소비자 데이터와 행동 인사이트를 활용하여"
        subText2="비즈니스 의사결정에 확신을 더하세요."
      />
      {/* 검색 폼 */}
      <SearchForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        isSearching={isSearching}
      />
      {/* 예시 검색어 */}
      {!hasSearched && (
        <div className="flex flex-col justify-center items-center text-sm text-gray-600 mt-4 gap-2">
          <div>이런 검색어로 시작해보세요</div>
          <div className="space-x-2">
            <Button
              variant="secondary"
              text="미혼이고 전문직"
              size="sm"
              onClick={() => handleExampleClick("미혼이고 전문직")}
            />
            <Button
              variant="secondary"
              text="대학원 졸업이고 차량 보유"
              size="sm"
              onClick={() => handleExampleClick("대학원 졸업이고 차량 보유")}
            />
            <Button
              variant="secondary"
              text="1인가구이고 대졸"
              size="sm"
              onClick={() => handleExampleClick("1인가구이고 대졸")}
            />
          </div>
        </div>
      )}
      {/* 검색 결과 */}
      {hasSearched && searchQuery && (
        <>
          <SearchResults
            results={searchResults}
            isSearching={isSearching}
            searchQuery={searchQuery}
          />
        </>
      )}
    </div>
  );
};

export default SearchPage;
