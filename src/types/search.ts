// (POST) /search/nl - request
export interface RequestSearchNlDto {
  query: string;
  use_vector_search: boolean;
  page: number;
  page_size: number;
}

// (POST) /search/nl - response
export interface ResponseSearchNlDto {
  requested_count: number;
  query: string;
  total_hits: number;
  max_score: number;
  results: SearchNlResults[];
  took_ms: number;
  page: number;
  page_size: number;
  has_more: boolean;
  llm_summary: LLMSummary;
}

export interface SearchNlResults {
  user_id: string;
  score: number;
  timestamp: string;
  survey_datetime?: string;
  demographic_info?: {
    age_group: string;
    gender: string;
    birth_year: string;
    region: string;
    occupation: boolean;
    marital_status: string;
    sub_region: string;
  };
  behaviors_info?: {
    smoker: boolean;
    has_vehicle: boolean;
    drinker: boolean;
  };
}

interface LLMSummary {
  model: string;
  generated_at: string;
  summary: {
    behavioral_summary: string;
    highlights: string[];
    demographic_summary: string[];
    data_signals: string[];
    follow_up_questions: string[];
  };
}

// (GET) /visualization/user-info/survey_responses_merged - response
export interface ResponseVisualization {
  index_name: string;
  total_docs: number;
  gender_distribution: Gender[];
  age_distribution: Age[];
  region_distribution: Region[];
  marital_status_distribution: Marry[];
  family_size_distribution: Family[];
  occupation_distribution: string[];
  income_distribution: Income[];
  vehicle_distribution: Vehicle[];
  smoker_distribution: Smoker[];
  drinker_distribution: Drinker[];
}

// (GET) /search/opensearch/{user_id} - response
export interface ResponseUserDetailDto {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: Array<{
      _index: string;
      _id: string;
      _score: number;
      _source: {
        user_id: string;
        timestamp?: string;
        metadata: {
          panel?: string;
          gender?: string;
          birth_year?: string;
          age?: number;
          age_group?: string;
          region?: string;
          sub_region?: string;
        };
        qa_pairs: Array<{
          q_text: string;
          answer: string | string[];
        }>;
      };
    }>;
  };
}

// 공통 분포 인터페이스
export interface Distribution<T extends string | number = string> {
  label: T;
  value: number;
  percentage: number;
  [key: string]: string | number; // Recharts 호환성을 위한 인덱스 시그니처
}

type GenderLabel = "남성" | "여성" | "미정";
type AgeLabel =
  | "0대"
  | "10대"
  | "20대"
  | "30대"
  | "40대"
  | "50대"
  | "60대"
  | "70대"
  | "80대"
  | "90대"
  | "100대"
  | "미정";
type RegionLabel =
  | "서울"
  | "경기"
  | "인천"
  | "부산"
  | "경남"
  | "대구"
  | "경북"
  | "대전"
  | "충남"
  | "미정"
  | "전북"
  | "광주"
  | "충북"
  | "전남"
  | "제주"
  | "세종"
  | "기타 / 해외"
  | "52"
  | "세종특별자치시"
  | "전북특별자치도";
type MarryLabel = "기혼" | "미혼" | "기타(사별/이혼 등)";
type FamilyLabel = "1명(혼자 거주)" | "2명" | "3명" | "4명" | "5명 이상";
type IncomeLabel =
  | "월 100만원 미만"
  | "월 100~199만원"
  | "월 200~299만원"
  | "월 300~399만원"
  | "월 400~499만원"
  | "월 500~599만원"
  | "월 600~699만원"
  | "월 700~799만원"
  | "월 800~899만원"
  | "월 900~999만원"
  | "월 1000만원 이상";
type VehicleLabel = "보유" | "미보유";
type SmokerLabel = "흡연" | "비흡연";
type DrinkerLabel = "음주" | "비음주";

type Gender = Distribution<GenderLabel>;
type Age = Distribution<AgeLabel>;
type Region = Distribution<RegionLabel>;
type Marry = Distribution<MarryLabel>;
type Family = Distribution<FamilyLabel>;
type Income = Distribution<IncomeLabel>;
type Vehicle = Distribution<VehicleLabel>;
type Smoker = Distribution<SmokerLabel>;
type Drinker = Distribution<DrinkerLabel>;
