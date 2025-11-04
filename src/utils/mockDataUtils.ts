// ==========================================
// 타입 정의
// ==========================================

export type QuestionType = "SINGLE" | "MULTI";

type QA_PAIRS = {
  q_code: string;
  q_text: string;
  q_type: QuestionType;
  answer_text: string | number;
  embedding_text: string;
};

export type SearchResponseDto = {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: HITS_TOTAL;
    max_score: number;
    hits: HITS[];
  };
};

type HITS = {
  _index: string;
  _id: string;
  _score: number;
  _source: {
    user_id: string;
    timestamp: string;
    qa_pairs: QA_PAIRS[];
  };
  inner_hits: {
    [key: string]: HIT_QUERY;
  };
};

type HIT_QUERY = {
  hits: {
    total: HITS_TOTAL;
    max_score: number;
    hits: HIT_QUERY_HITS[];
  };
};

type HITS_TOTAL = {
  value: number;
  relation: string;
};

type HIT_QUERY_HITS = {
  _index: string;
  _id: string;
  _nested: {
    field: string;
    offset: number;
  };
  _score: number;
  _source: QA_PAIRS;
};

// ==========================================
// Mock Data
// ==========================================

/**
 * 전문직이고 미혼인 응답자 Mock Data
 */
export const mockSurveyData: SearchResponseDto = {
  took: 128,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0,
  },
  hits: {
    total: {
      value: 5656,
      relation: "eq",
    },
    max_score: 14.736721,
    hits: [
      {
        _index: "survey_responses_30000",
        _id: "w56288763987799",
        _score: 14.736721,
        _source: {
          user_id: "w56288763987799",
          timestamp: "2025-10-10T23:47:12.679314",
          qa_pairs: [
            {
              q_code: "Q1",
              q_text: "결혼여부",
              q_type: "SINGLE",
              answer_text: "미혼",
              embedding_text: "결혼여부 질문에 '미혼'라고 답변",
            },
            {
              q_code: "Q3",
              q_text: "가족수",
              q_type: "SINGLE",
              answer_text: "3명",
              embedding_text: "가족수 질문에 '3명'라고 답변",
            },
            {
              q_code: "Q4",
              q_text: "최종학력",
              q_type: "SINGLE",
              answer_text: "대학원 재학/졸업 이상",
              embedding_text:
                "최종학력 질문에 '대학원 재학/졸업 이상'라고 답변",
            },
            {
              q_code: "Q5",
              q_text: "직업",
              q_type: "SINGLE",
              answer_text: "전문직 (의사",
              embedding_text: "직업 질문에 '전문직 (의사'라고 답변",
            },
            {
              q_code: "Q5_1",
              q_text: "직무",
              q_type: "SINGLE",
              answer_text: "전자•기계•기술•화학•연구개발",
              embedding_text:
                "직무 질문에 '전자•기계•기술•화학•연구개발'라고 답변",
            },
            {
              q_code: "Q6",
              q_text: "월평균 개인소득",
              q_type: "SINGLE",
              answer_text: 4,
              embedding_text: "월평균 개인소득 질문에 '4.0'라고 답변",
            },
            {
              q_code: "Q7",
              q_text: "월평균 가구소득",
              q_type: "SINGLE",
              answer_text: 11,
              embedding_text: "월평균 가구소득 질문에 '11.0'라고 답변",
            },
            {
              q_code: "Q8",
              q_text: "보유 가전제품",
              q_type: "MULTI",
              answer_text: "TV",
              embedding_text: "보유 가전제품 질문에 'TV'라고 답변",
            },
            {
              q_code: "Q8",
              q_text: "보유 가전제품",
              q_type: "MULTI",
              answer_text: "냉장고",
              embedding_text: "보유 가전제품 질문에 '냉장고'라고 답변",
            },
            {
              q_code: "Q8",
              q_text: "보유 가전제품",
              q_type: "MULTI",
              answer_text: "김치냉장고",
              embedding_text: "보유 가전제품 질문에 '김치냉장고'라고 답변",
            },
            {
              q_code: "Q8",
              q_text: "보유 가전제품",
              q_type: "MULTI",
              answer_text: "세탁기",
              embedding_text: "보유 가전제품 질문에 '세탁기'라고 답변",
            },
            {
              q_code: "Q8",
              q_text: "보유 가전제품",
              q_type: "MULTI",
              answer_text: "에어컨",
              embedding_text: "보유 가전제품 질문에 '에어컨'라고 답변",
            },
            {
              q_code: "Q8",
              q_text: "보유 가전제품",
              q_type: "MULTI",
              answer_text: "일반청소기",
              embedding_text: "보유 가전제품 질문에 '일반청소기'라고 답변",
            },
            {
              q_code: "Q8",
              q_text: "보유 가전제품",
              q_type: "MULTI",
              answer_text: "데스크탑",
              embedding_text: "보유 가전제품 질문에 '데스크탑'라고 답변",
            },
            {
              q_code: "Q9_1",
              q_text: "보유 휴대폰 단말기 브랜드",
              q_type: "SINGLE",
              answer_text: "삼성전자 (갤럭시",
              embedding_text:
                "보유 휴대폰 단말기 브랜드 질문에 '삼성전자 (갤럭시'라고 답변",
            },
            {
              q_code: "Q9_2",
              q_text: "보유 휴대폰 모델명",
              q_type: "SINGLE",
              answer_text: "갤럭시 Z Filp 시리즈",
              embedding_text:
                "보유 휴대폰 모델명 질문에 '갤럭시 Z Filp 시리즈'라고 답변",
            },
            {
              q_code: "Q10",
              q_text: "보유차량여부",
              q_type: "SINGLE",
              answer_text: "있다",
              embedding_text: "보유차량여부 질문에 '있다'라고 답변",
            },
            {
              q_code: "Q11_1",
              q_text: "자동차 제조사",
              q_type: "SINGLE",
              answer_text: "BMW",
              embedding_text: "자동차 제조사 질문에 'BMW'라고 답변",
            },
            {
              q_code: "Q11_2",
              q_text: "자동차 모델",
              q_type: "SINGLE",
              answer_text: "미니",
              embedding_text: "자동차 모델 질문에 '미니'라고 답변",
            },
            {
              q_code: "Q12",
              q_text: "흡연경험",
              q_type: "MULTI",
              answer_text: "담배를 피워본 적이 없다",
              embedding_text:
                "흡연경험 질문에 '담배를 피워본 적이 없다'라고 답변",
            },
            {
              q_code: "Q13",
              q_text: "음용경험 술",
              q_type: "MULTI",
              answer_text: "막걸리/탁주",
              embedding_text: "음용경험 술 질문에 '막걸리/탁주'라고 답변",
            },
          ],
        },
        inner_hits: {
          hit_전문직: {
            hits: {
              total: {
                value: 1,
                relation: "eq",
              },
              max_score: 9.027011,
              hits: [
                {
                  _index: "survey_responses_30000",
                  _id: "w56288763987799",
                  _nested: {
                    field: "qa_pairs",
                    offset: 3,
                  },
                  _score: 9.027011,
                  _source: {
                    q_code: "Q5",
                    q_text: "직업",
                    q_type: "SINGLE",
                    answer_text: "전문직 (의사",
                    embedding_text: "직업 질문에 '전문직 (의사'라고 답변",
                  },
                },
              ],
            },
          },
          hit_미혼: {
            hits: {
              total: {
                value: 1,
                relation: "eq",
              },
              max_score: 5.70971,
              hits: [
                {
                  _index: "survey_responses_30000",
                  _id: "w56288763987799",
                  _nested: {
                    field: "qa_pairs",
                    offset: 0,
                  },
                  _score: 5.70971,
                  _source: {
                    q_code: "Q1",
                    q_text: "결혼여부",
                    q_type: "SINGLE",
                    answer_text: "미혼",
                    embedding_text: "결혼여부 질문에 '미혼'라고 답변",
                  },
                },
              ],
            },
          },
        },
      },
      {
        _index: "survey_responses_30000",
        _id: "w281470020132422",
        _score: 14.736721,
        _source: {
          user_id: "w281470020132422",
          timestamp: "2025-10-10T23:47:12.757177",
          qa_pairs: [
            {
              q_code: "Q1",
              q_text: "결혼여부",
              q_type: "SINGLE",
              answer_text: "미혼",
              embedding_text: "결혼여부 질문에 '미혼'라고 답변",
            },
            {
              q_code: "Q3",
              q_text: "가족수",
              q_type: "SINGLE",
              answer_text: "1명(혼자 거주)",
              embedding_text: "가족수 질문에 '1명(혼자 거주)'라고 답변",
            },
            {
              q_code: "Q4",
              q_text: "최종학력",
              q_type: "SINGLE",
              answer_text: "고등학교 졸업 이하",
              embedding_text: "최종학력 질문에 '고등학교 졸업 이하'라고 답변",
            },
            {
              q_code: "Q5",
              q_text: "직업",
              q_type: "SINGLE",
              answer_text: "전문직 (의사",
              embedding_text: "직업 질문에 '전문직 (의사'라고 답변",
            },
            {
              q_code: "Q5_1",
              q_text: "직무",
              q_type: "SINGLE",
              answer_text: "재무•회계•경리",
              embedding_text: "직무 질문에 '재무•회계•경리'라고 답변",
            },
            {
              q_code: "Q6",
              q_text: "월평균 개인소득",
              q_type: "SINGLE",
              answer_text: 7,
              embedding_text: "월평균 개인소득 질문에 '7.0'라고 답변",
            },
            {
              q_code: "Q7",
              q_text: "월평균 가구소득",
              q_type: "SINGLE",
              answer_text: 7,
              embedding_text: "월평균 가구소득 질문에 '7.0'라고 답변",
            },
            {
              q_code: "Q8",
              q_text: "보유 가전제품",
              q_type: "MULTI",
              answer_text: "가정용 식물 재배기",
              embedding_text:
                "보유 가전제품 질문에 '가정용 식물 재배기'라고 답변",
            },
            {
              q_code: "Q9_1",
              q_text: "보유 휴대폰 단말기 브랜드",
              q_type: "SINGLE",
              answer_text: "삼성전자 (갤럭시",
              embedding_text:
                "보유 휴대폰 단말기 브랜드 질문에 '삼성전자 (갤럭시'라고 답변",
            },
            {
              q_code: "Q9_2",
              q_text: "보유 휴대폰 모델명",
              q_type: "SINGLE",
              answer_text: "점프",
              embedding_text: "보유 휴대폰 모델명 질문에 '점프'라고 답변",
            },
            {
              q_code: "Q10",
              q_text: "보유차량여부",
              q_type: "SINGLE",
              answer_text: "있다",
              embedding_text: "보유차량여부 질문에 '있다'라고 답변",
            },
            {
              q_code: "Q11_1",
              q_text: "자동차 제조사",
              q_type: "SINGLE",
              answer_text: "메르체데스-벤츠",
              embedding_text: "자동차 제조사 질문에 '메르체데스-벤츠'라고 답변",
            },
            {
              q_code: "Q11_2",
              q_text: "자동차 모델",
              q_type: "SINGLE",
              answer_text: "E-Class (E 클래스)",
              embedding_text:
                "자동차 모델 질문에 'E-Class (E 클래스)'라고 답변",
            },
            {
              q_code: "Q12",
              q_text: "흡연경험",
              q_type: "MULTI",
              answer_text: "일반 담배",
              embedding_text: "흡연경험 질문에 '일반 담배'라고 답변",
            },
            {
              q_code: "Q12_1",
              q_text: "흡연경험 담배브랜드",
              q_type: "MULTI",
              answer_text: "레종",
              embedding_text: "흡연경험 담배브랜드 질문에 '레종'라고 답변",
            },
            {
              q_code: "Q13",
              q_text: "음용경험 술",
              q_type: "MULTI",
              answer_text: "소주",
              embedding_text: "음용경험 술 질문에 '소주'라고 답변",
            },
          ],
        },
        inner_hits: {
          hit_전문직: {
            hits: {
              total: {
                value: 1,
                relation: "eq",
              },
              max_score: 9.027011,
              hits: [
                {
                  _index: "survey_responses_30000",
                  _id: "w281470020132422",
                  _nested: {
                    field: "qa_pairs",
                    offset: 3,
                  },
                  _score: 9.027011,
                  _source: {
                    q_code: "Q5",
                    q_text: "직업",
                    q_type: "SINGLE",
                    answer_text: "전문직 (의사",
                    embedding_text: "직업 질문에 '전문직 (의사'라고 답변",
                  },
                },
              ],
            },
          },
          hit_미혼: {
            hits: {
              total: {
                value: 1,
                relation: "eq",
              },
              max_score: 5.70971,
              hits: [
                {
                  _index: "survey_responses_30000",
                  _id: "w281470020132422",
                  _nested: {
                    field: "qa_pairs",
                    offset: 0,
                  },
                  _score: 5.70971,
                  _source: {
                    q_code: "Q1",
                    q_text: "결혼여부",
                    q_type: "SINGLE",
                    answer_text: "미혼",
                    embedding_text: "결혼여부 질문에 '미혼'라고 답변",
                  },
                },
              ],
            },
          },
        },
      },
    ],
  },
};

// ==========================================
// 유틸리티 함수들
// ==========================================

/**
 * 검색 결과에서 응답자 데이터만 추출
 */
export function extractResponses(searchResult: SearchResponseDto) {
  return searchResult.hits.hits.map((hit) => hit._source);
}

/**
 * 응답자의 특정 질문에 대한 모든 답변을 찾는 함수
 */
export function getAnswersByQuestionCode(
  response: HITS["_source"],
  qCode: string
): QA_PAIRS[] {
  return response.qa_pairs.filter((pair) => pair.q_code === qCode);
}

/**
 * MULTI 타입 질문의 모든 답변을 배열로 반환
 */
export function getMultiAnswers(
  response: HITS["_source"],
  qCode: string
): string[] {
  return response.qa_pairs
    .filter((pair) => pair.q_code === qCode && pair.q_type === "MULTI")
    .map((pair) => String(pair.answer_text));
}

/**
 * SINGLE 타입 질문의 답변을 반환
 */
export function getSingleAnswer(
  response: HITS["_source"],
  qCode: string
): string | number | null {
  const answer = response.qa_pairs.find(
    (pair) => pair.q_code === qCode && pair.q_type === "SINGLE"
  );
  return answer ? answer.answer_text : null;
}

/**
 * 전체 응답자 수를 반환
 */
export function getTotalCount(searchResult: SearchResponseDto): number {
  return searchResult.hits.total.value;
}

/**
 * 특정 조건을 만족하는 응답자 필터링
 */
export function filterResponses(
  searchResult: SearchResponseDto,
  filterFn: (response: HITS["_source"]) => boolean
) {
  return extractResponses(searchResult).filter(filterFn);
}
