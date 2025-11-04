import type { SearchResponseDto } from "../types/search";

// 전문직이고 미혼인 응답자
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
