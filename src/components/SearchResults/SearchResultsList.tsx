import { useState } from "react";
import { Eye } from "lucide-react";
import type { ResponseSearchNlDto } from "../../types/search";
import useGetUserDetail from "../../hooks/queries/useGetUserDetail";
import UserDetailModal from "./UserDetailModal";

interface SearchResultsListProps {
  data: ResponseSearchNlDto;
}

const SearchResultsList = ({ data }: SearchResultsListProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: userDetail, isLoading: isLoadingDetail } =
    useGetUserDetail(selectedUserId);

  const handleDetailClick = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
  };

  if (!data.results || data.results.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          검색 결과 ({data.results.length}개)
        </h2>
        <div className="text-sm text-gray-500">
          총 {data.total_hits.toLocaleString()}명 중 {data.results.length}개 표시
        </div>
      </div>

      <div className="space-y-3">
        {data.results.map((result, index) => {
          return (
            <div
              key={result.user_id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* 기본 정보 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <span className="text-lg font-semibold text-gray-900">
                      사용자 ID: {result.user_id}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      점수: {result.score.toFixed(2)}
                    </span>
                  </div>

                  {/* 인구통계 정보 */}
                  {result.demographic_info && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                      <div>
                        <span className="text-gray-500">연령대:</span>{" "}
                        <span className="font-medium">
                          {result.demographic_info.age_group || "미정"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">성별:</span>{" "}
                        <span className="font-medium">
                          {result.demographic_info.gender || "미정"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">지역:</span>{" "}
                        <span className="font-medium">
                          {result.demographic_info.region || "미정"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">결혼상태:</span>{" "}
                        <span className="font-medium">
                          {result.demographic_info.marital_status || "미정"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* 행동 정보 */}
                  {result.behaviors_info && (
                    <div className="flex gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-500">흡연:</span>{" "}
                        <span className="font-medium">
                          {result.behaviors_info.smoker ? "예" : "아니오"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">음주:</span>{" "}
                        <span className="font-medium">
                          {result.behaviors_info.drinker ? "예" : "아니오"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">차량보유:</span>{" "}
                        <span className="font-medium">
                          {result.behaviors_info.has_vehicle ? "예" : "아니오"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 상세보기 버튼 */}
                <button
                  onClick={() => handleDetailClick(result.user_id)}
                  className="ml-4 flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors shrink-0"
                >
                  <Eye className="w-4 h-4" />
                  상세보기
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 사용자 상세 정보 모달 */}
      <UserDetailModal
        isOpen={!!selectedUserId}
        onClose={handleCloseModal}
        userDetail={userDetail}
        isLoading={isLoadingDetail}
        userId={selectedUserId}
      />
    </div>
  );
};

export default SearchResultsList;

