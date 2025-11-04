import { useState } from "react";
import Button from "../components/common/Button";
import LandingText from "../components/common/LandingText";
import SearchForm from "../components/common/SearchForm";

// mockData 테스트용
import { mockSurveyData } from "../data/mockData";
import {
  extractResponses,
  filterResponses,
  getMultiAnswers,
  getSingleAnswer,
  getTotalCount,
} from "../utils/mockDataUtils";

import type { ResponseDto } from "../types/search";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [responses, setResponses] = useState<ResponseDto[]>([]);
  const [firstResponse, setFirstResponse] = useState<ResponseDto>();
  const [filteredResponse, setFilteredResponse] = useState<[]>([]);

  // 검색 핸들러
  /* const handleSearch = () => {
    const filters = extractResponses(mockSurveyData);
    setExtractedFilters(filters);

    const filtered = filterResponses(mockSurveyData, (response) => {
      const income = getSingleAnswer(response, "Q6");
      return typeof income === "number" && income >= 5;
    });
    setSearchResults(filtered);
  }; */

  // mockData 테스트
  // 전체 응답자 수
  console.log("총 응답자 수:", getTotalCount(mockSurveyData));

  // 응답자 데이터 추출
  const extractResponsesTemp = extractResponses(mockSurveyData);
  setResponses(extractResponsesTemp);
  console.log("추출된 응답자 수:", responses.length);

  if (responses.length > 0) {
    // 첫 번째 응답자의 결혼여부
    setFirstResponse(responses[0]);
    console.log("결혼여부:", getSingleAnswer(firstResponse, "Q1"));

    // 첫 번째 응답자의 보유 가전제품
    const appliances = getMultiAnswers(firstResponse, "Q8");
    console.log("보유 가전제품:", appliances);
  }

  // 소득 구간이 5 이상인 응답자 필터링
  const filterTemp = filterResponses(mockSurveyData, (response) => {
    const income = getSingleAnswer(response, "Q6");
    return typeof income === "number" && income >= 5;
  });
  console.log("고소득 응답자 수:", filterTemp.length);
  setFilteredResponse(filterTemp);

  return (
    <div className="flex flex-col p-10 mt-10 gap-10">
      <LandingText
        titleText1="실제 사람들에게서"
        titleTextSpan="새로운 인사이트"
        titleTextBack="를 발견하세요"
        subText1="포괄적인 소비자 데이터와 행동 인사이트를 활용하여"
        subText2="비즈니스 의사결정에 확신을 더하세요."
      />

      {/* <InputForm
        type="search"
        setValue={() => setSearch(search)}
        labelOnOff={false}
      /> */}
      <SearchForm
        keyword={searchQuery}
        setKeyword={setSearchQuery}
        onSearch={handleSearch}
      />

      <div className="flex flex-col justify-center items-center text-sm text-gray-600 mt-4 gap-3">
        <div>이런 검색어로 시작해보세요</div>
        <div className="space-x-2">
          <Button
            variant="secondary"
            text="서울 중구에 사는 전문직 여성"
            size="sm"
          />
          <Button
            variant="secondary"
            text="1980년생이고 미혼인 20대"
            size="sm"
          />
        </div>
      </div>

      {/* 목데이터 테스트 */}
    </div>
  );
};

export default SearchPage;
