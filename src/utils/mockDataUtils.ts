import type { QAPAIRS, ResponseDto, SearchResponseDto } from "../types/search";

// 전체 응답자 수
// ex) 총 응답자 수: 5656명
export function getTotalCount(searchResult: SearchResponseDto): number {
  return searchResult.hits.total.value;
}

// 검색 결과에서 응답자 데이터만 추출
// extractResponses(mockSurveyData))
export function extractResponses(searchResult: SearchResponseDto) {
  return searchResult.hits.hits.map((hit) => hit._source); // 응답자 데이터 배열 (_source)
}

// 응답자의 특정 질문에 대한 모든 답변 찾기
export function getAnswersByQuestionCode(
  response: ResponseDto, // 응답자 데이터 (_source 객체)
  qCode: string
): QAPAIRS[] {
  return response.qa_pairs.filter((pair) => pair.q_code === qCode); // 해당 질문 코드의 답변 배열 (MULTI라면 여러개)
}

// 응답 1개인(SINGLE 타입) 질문 답변 1개를 return
// ex) getSingleAnswer(response[0], "Q1")
//    => "미혼"
export function getSingleAnswer(
  response: ResponseDto, // 응답자 데이터 객체
  qCode: string
): string | number | null {
  const answer = response.qa_pairs.find(
    (pair) => pair.q_code === qCode && pair.q_type === "SINGLE"
  );
  return answer ? answer.answer_text : null; // string || number || null
}

// 응답 여러개인(MULTI 타입) 질문 답변을 배열로 return
// ex) getSingleAnswer(response[0], "Q8")
//     => ["냉장고", "세탁기", "에어컨"]
export function getMultiAnswers(
  response: ResponseDto,
  qCode: string
): string[] {
  return response.qa_pairs
    .filter((pair) => pair.q_code === qCode && pair.q_type === "MULTI")
    .map((pair) => String(pair.answer_text)); // 답변 배열
}

// 특정 조건 만족하는 응답자 필터링
export function filterResponses(
  searchResult: SearchResponseDto, // SearchResponseDto 타입의 검색 결과
  filterFn: (response: ResponseDto) => boolean
) {
  return extractResponses(searchResult).filter(filterFn); // 필터링된 응답자 배열
}
