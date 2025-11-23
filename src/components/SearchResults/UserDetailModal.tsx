import { X } from "lucide-react";
import type { ResponseUserDetailDto } from "../../types/search";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userDetail: ResponseUserDetailDto | undefined;
  isLoading: boolean;
  userId: string | null;
}

const UserDetailModal = ({
  isOpen,
  onClose,
  userDetail,
  isLoading,
  userId,
}: UserDetailModalProps) => {
  console.log("🟢 UserDetailModal 렌더링:", { isOpen, isLoading, hasUserDetail: !!userDetail, userId });
  
  if (!isOpen) {
    console.log("🟢 모달이 닫혀있음");
    return null;
  }

  // 실제 응답 구조에 맞게 수정: hits는 배열일 수도 있고 중첩 객체일 수도 있음
  type SourceType = {
    user_id: string;
    timestamp?: string;
    metadata?: {
      panel?: string;
      gender?: string;
      birth_year?: number | string;
      age?: number;
      age_group?: string;
      region?: string;
      sub_region?: string;
    };
    qa_pairs?: Array<{
      q_text: string;
      answer: string | string[];
    }>;
  };
  
  const getSource = (): SourceType | undefined => {
    if (!userDetail?.hits) return undefined;
    if (Array.isArray(userDetail.hits)) {
      return userDetail.hits[0]?._source as SourceType | undefined;
    }
    if (typeof userDetail.hits === 'object' && 'hits' in userDetail.hits) {
      return (userDetail.hits as { hits: Array<{ _source: SourceType }> }).hits[0]?._source;
    }
    return undefined;
  };
  
  const source = getSource();
  console.log("🟢 모달 소스 데이터:", source);
  console.log("🟢 userDetail 구조:", userDetail);
  console.log("🟢 hits 타입:", Array.isArray(userDetail?.hits) ? "배열" : "객체");

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col relative z-[10000]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">
            사용자 상세 정보
            {userId && (
              <span className="ml-2 text-lg font-normal text-gray-500">
                ({userId})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">로딩 중...</p>
              </div>
            </div>
          ) : source ? (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  기본 정보
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">사용자 ID:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {source.user_id}
                    </span>
                  </div>
                  {source.timestamp && (
                    <div>
                      <span className="text-gray-500">타임스탬프:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(source.timestamp).toLocaleString("ko-KR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 메타데이터 */}
              {source.metadata && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    인구통계 정보
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    {source.metadata.panel && (
                      <div>
                        <span className="text-gray-500">패널:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {source.metadata.panel}
                        </span>
                      </div>
                    )}
                    {source.metadata.gender && (
                      <div>
                        <span className="text-gray-500">성별:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {source.metadata.gender}
                        </span>
                      </div>
                    )}
                    {source.metadata.birth_year && (
                      <div>
                        <span className="text-gray-500">출생년도:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {source.metadata.birth_year}
                        </span>
                      </div>
                    )}
                    {source.metadata.age !== undefined && (
                      <div>
                        <span className="text-gray-500">나이:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {source.metadata.age}세
                        </span>
                      </div>
                    )}
                    {source.metadata.age_group && (
                      <div>
                        <span className="text-gray-500">연령대:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {source.metadata.age_group}
                        </span>
                      </div>
                    )}
                    {source.metadata.region && (
                      <div>
                        <span className="text-gray-500">지역:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {source.metadata.region}
                        </span>
                      </div>
                    )}
                    {source.metadata.sub_region && (
                      <div>
                        <span className="text-gray-500">세부지역:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {source.metadata.sub_region}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 질문-답변 쌍 */}
              {source.qa_pairs && source.qa_pairs.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    질문-답변 ({source.qa_pairs.length}개)
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {source.qa_pairs.map((qa: { q_text: string; answer: string | string[] }, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        <div className="font-medium text-gray-900 mb-2">
                          Q: {qa.q_text}
                        </div>
                        <div className="text-gray-700">
                          A:{" "}
                          {Array.isArray(qa.answer) ? (
                            <div className="mt-1">
                              <ul className="list-disc list-inside space-y-1">
                                {qa.answer.map((item: string, idx: number) => (
                                  <li key={idx}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <span className="font-medium">{qa.answer}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 검색 정보 */}
              {userDetail && (
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    검색 정보
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-gray-500">매칭 점수:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {Array.isArray(userDetail.hits) 
                          ? userDetail.hits[0]?._score?.toFixed(2) || "-"
                          : typeof userDetail.hits === 'object' && 'hits' in userDetail.hits
                          ? (userDetail.hits as { hits: Array<{ _score?: number }> }).hits[0]?._score?.toFixed(2) || "-"
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">소요 시간:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {userDetail.took || "-"}ms
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">인덱스:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {Array.isArray(userDetail.hits)
                          ? userDetail.hits[0]?._index || "-"
                          : typeof userDetail.hits === 'object' && 'hits' in userDetail.hits
                          ? (userDetail.hits as { hits: Array<{ _index?: string }> }).hits[0]?._index || "-"
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">문서 ID:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {Array.isArray(userDetail.hits)
                          ? userDetail.hits[0]?._id || "-"
                          : typeof userDetail.hits === 'object' && 'hits' in userDetail.hits
                          ? (userDetail.hits as { hits: Array<{ _id?: string }> }).hits[0]?._id || "-"
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;

