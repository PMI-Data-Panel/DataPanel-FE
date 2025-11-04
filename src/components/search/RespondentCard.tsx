import { User, Briefcase, GraduationCap, Car } from "lucide-react";
import { getSingleAnswer } from "../../utils/mockDataUtils";

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

interface RespondentCardProps {
  response: ResponseSource;
  index: number;
  onClick: () => void;
}

const RespondentCard = ({ response, index, onClick }: RespondentCardProps) => {
  // 주요 정보 추출
  const maritalStatus = getSingleAnswer(response, "Q1");
  const education = getSingleAnswer(response, "Q4");
  const occupation = getSingleAnswer(response, "Q5");
  const hasVehicle = getSingleAnswer(response, "Q10");
  const personalIncome = getSingleAnswer(response, "Q6");

  return (
    <div
      onClick={onClick}
      className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer group h-full"
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full group-hover:bg-blue-200 transition-colors">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">응답자 #{index + 1}</h3>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              {response.user_id}
            </p>
          </div>
        </div>
      </div>

      {/* 주요 정보 */}
      <div className="space-y-3">
        <InfoRow
          icon={<User className="w-4 h-4" />}
          label="결혼 여부"
          value={maritalStatus}
        />
        <InfoRow
          icon={<Briefcase className="w-4 h-4" />}
          label="직업"
          value={occupation}
        />
        <InfoRow
          icon={<GraduationCap className="w-4 h-4" />}
          label="학력"
          value={education}
        />
        <InfoRow
          icon={<Car className="w-4 h-4" />}
          label="차량"
          value={hasVehicle === "있다" ? "보유" : "미보유"}
        />
      </div>

      {/* 소득 배지 */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">개인소득</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            구간 {personalIncome}
          </span>
        </div>
      </div>

      {/* 상세보기 버튼 */}
      <div className="mt-4">
        <div className="text-center text-sm text-blue-600 group-hover:text-blue-800 font-medium">
          상세보기 →
        </div>
      </div>
    </div>
  );
};

/**
 * 정보 행 컴포넌트
 */
const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number | null;
}) => (
  <div className="flex items-start gap-2">
    <div className="text-gray-400 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800 break-words">
        {value || "정보 없음"}
      </p>
    </div>
  </div>
);

export default RespondentCard;
