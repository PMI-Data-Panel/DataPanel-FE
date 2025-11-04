export type QuestionType = "SINGLE" | "MULTI";

export type QAPAIRS = {
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

// SearchPage에서 reesponses 상태 타입
export type ResponseDto = {
  user_id: string;
  timestamp: string;
  qa_pairs: QAPAIRS[];
};

export type HITS = {
  _index: string;
  _id: string;
  _score: number;
  _source: ResponseDto;
  inner_hits: {
    [key: string]: HIT_QUERY;
  };
};

/* type INNER_HITS = {
  hit_query: HIT_QUERY[];
}; */

// 동적 키를 가짐 (ex. hit_전문직, hit_미혼)
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
  //survey_response_id: string;
  _id: string;
  _nested: {
    field: string;
    offset: number;
  };
  _score: number;
  _source: QAPAIRS;
};
