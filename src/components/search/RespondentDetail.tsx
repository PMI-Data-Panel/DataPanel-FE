import { getMultiAnswers, getSingleAnswer } from "../../utils/mockDataUtils";

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

interface RespondentDetailProps {
  response: ResponseSource;
}

const RespondentDetail = ({ response }: RespondentDetailProps) => {
  // 모든 정보 추출
  const maritalStatus = getSingleAnswer(response, "Q1");
  const familySize = getSingleAnswer(response, "Q3");
  const education = getSingleAnswer(response, "Q4");
  const occupation = getSingleAnswer(response, "Q5");
  const jobFunction = getSingleAnswer(response, "Q5_1");
  const personalIncome = getSingleAnswer(response, "Q6");
  const householdIncome = getSingleAnswer(response, "Q7");
  const appliances = getMultiAnswers(response, "Q8");
  const phoneBrand = getSingleAnswer(response, "Q9_1");
  const phoneModel = getSingleAnswer(response, "Q9_2");
  const hasVehicle = getSingleAnswer(response, "Q10");
  const carMaker = getSingleAnswer(response, "Q11_1");
  const carModel = getSingleAnswer(response, "Q11_2");
  const smokingExperience = getMultiAnswers(response, "Q12");
  const alcoholExperience = getMultiAnswers(response, "Q13");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        응답자 상세 정보
      </h2>

      {/* 기본 정보 */}
      <Section title="기본 정보">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="응답자 ID" value={response.user_id} />
          <InfoItem
            label="응답 시간"
            value={new Date(response.timestamp).toLocaleString("ko-KR")}
          />
          <InfoItem label="결혼 여부" value={maritalStatus} />
          <InfoItem label="가족 수" value={familySize} />
        </div>
      </Section>

      {/* 학력 및 직업 */}
      <Section title="학력 및 직업">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem label="최종 학력" value={education} />
          <InfoItem label="직업" value={occupation} />
        </div>
        <InfoItem label="직무" value={jobFunction} className="mt-4" />
      </Section>

      {/* 소득 정보 */}
      <Section title="소득 정보">
        <div className="grid grid-cols-2 gap-4">
          <InfoItem
            label="월평균 개인소득"
            value={personalIncome !== null ? `구간 ${personalIncome}` : null}
          />
          <InfoItem
            label="월평균 가구소득"
            value={householdIncome !== null ? `구간 ${householdIncome}` : null}
          />
        </div>
      </Section>

      {/* 보유 자산 */}
      <Section title="보유 자산">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              보유 가전제품
            </p>
            <div className="flex flex-wrap gap-2">
              {appliances.length > 0 ? (
                appliances.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">정보 없음</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoItem label="휴대폰 브랜드" value={phoneBrand} />
            <InfoItem label="휴대폰 모델" value={phoneModel} />
          </div>

          <InfoItem label="차량 보유 여부" value={hasVehicle} />

          {hasVehicle === "있다" && (
            <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-blue-200">
              <InfoItem label="자동차 제조사" value={carMaker} />
              <InfoItem label="자동차 모델" value={carModel} />
            </div>
          )}
        </div>
      </Section>

      {/* 생활습관 */}
      <Section title="생활습관">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">흡연 경험</p>
            <div className="flex flex-wrap gap-2">
              {smokingExperience.length > 0 ? (
                smokingExperience.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">정보 없음</span>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-600 mb-2">음주 경험</p>
            <div className="flex flex-wrap gap-2">
              {alcoholExperience.length > 0 ? (
                alcoholExperience.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">정보 없음</span>
              )}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

/**
 * 섹션 컴포넌트
 */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-6 pb-6 border-b border-gray-200 last:border-b-0">
    <h3 className="text-lg font-semibold mb-4 text-gray-700">{title}</h3>
    {children}
  </div>
);

/**
 * 정보 항목 컴포넌트
 */
const InfoItem = ({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number | null;
  className?: string;
}) => (
  <div className={className}>
    <p className="text-sm font-medium text-gray-600">{label}</p>
    <p className="text-base text-gray-800 mt-1">
      {value !== null ? (
        value
      ) : (
        <span className="text-gray-400">정보 없음</span>
      )}
    </p>
  </div>
);

export default RespondentDetail;
