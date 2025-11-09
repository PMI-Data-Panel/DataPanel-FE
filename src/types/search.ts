export interface RequestSearchDto {
  query: string;
  index_name?: string;
  size?: number;
}

export interface ResponseSearchDto {
  message: string;
  task_id: string;
  status_url: string;
}

export interface ResponseSearchPullingDto {
  state: string; // 작업 상태 (SUCCESS, FAILURE)
  message: string;
  ready: boolean;
  result: {
    query: string;
    total_hits: number;
    max_score: number;
    results: ResultsDto[];
    took_ms: number;
    query_analysis: {
      keywords: string[];
      filters_applied: boolean;
    };
  };
}

interface ResultsDto {
  user_id: string;
  score: number;
  demographic_info: {
    age_group: string;
    occupation: string;
  };
  qa_pairs: QA_Pairs[];
}

interface QA_Pairs {
  question: string;
  answer: string;
}
