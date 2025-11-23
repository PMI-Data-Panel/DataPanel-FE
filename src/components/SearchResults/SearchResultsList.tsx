import { useState, useEffect } from "react";
import { Eye, Download } from "lucide-react";
import type { ResponseSearchNlDto, SearchNlResults } from "../../types/search";
import useGetUserDetail from "../../hooks/queries/useGetUserDetail";
import UserDetailModal from "./UserDetailModal";

interface SearchResultsListProps {
  data: ResponseSearchNlDto;
  allResults: SearchNlResults[]; // 전체 검색 결과 데이터
  query: string; // 검색어
}

const SearchResultsList = ({ data, allResults, query }: SearchResultsListProps) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { data: userDetail, isLoading: isLoadingDetail } =
    useGetUserDetail(selectedUserId);

  const handleDetailClick = (userId: string) => {
    console.log("🔵 사용자 상세 정보 요청:", userId);
    setSelectedUserId(userId);
  };

  const handleExportAllCSV = () => {
    if (!allResults || allResults.length === 0) return;

    const headers = [
      "사용자 ID",
      "점수",
      "연령대",
      "성별",
      "출생연도",
      "지역",
      "거주지",
      "결혼상태",
      "직업",
      "흡연",
      "음주",
      "차량보유",
      "설문일시",
    ];

    const rows = allResults.map((panel) => [
      String(panel.user_id || ""),
      panel.score !== undefined && panel.score !== null ? String(panel.score.toFixed(2)) : "",
      String(panel.demographic_info?.age_group || ""),
      String(panel.demographic_info?.gender || ""),
      panel.demographic_info?.birth_year ? String(panel.demographic_info.birth_year) : "",
      String(panel.demographic_info?.region || ""),
      String(panel.demographic_info?.sub_region || ""),
      String(panel.demographic_info?.marital_status || ""),
      panel.demographic_info?.occupation ? "예" : "아니오",
      panel.behaviors_info?.smoker ? "예" : "아니오",
      panel.behaviors_info?.drinker ? "예" : "아니오",
      panel.behaviors_info?.has_vehicle ? "예" : "아니오",
      String(panel.survey_datetime || ""),
    ]);

    // CSV 형식으로 변환 (쉼표와 따옴표 처리)
    const escapeCSV = (value: string | number | null | undefined) => {
      // null, undefined를 빈 문자열로 변환
      const strValue = value === null || value === undefined ? "" : String(value);
      // 빈 문자열이면 그대로 반환
      if (strValue === "") return strValue;
      // 쉼표, 따옴표, 줄바꿈이 포함되어 있으면 따옴표로 감싸기
      if (strValue.includes(",") || strValue.includes('"') || strValue.includes("\n")) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // BOM 추가 (한글 깨짐 방지)
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const sanitizedQuery = query.replace(/[^a-zA-Z0-9가-힣]/g, "_");
    link.download = `전체검색결과_${sanitizedQuery}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 사용자 상세 정보가 로드되면 로그 출력
  useEffect(() => {
    if (userDetail && selectedUserId) {
      console.log("📥 사용자 상세 정보 응답 받음");
      console.log("📥 사용자 ID:", selectedUserId);
      console.log("📥 전체 응답 데이터:", JSON.stringify(userDetail, null, 2));
      // 실제 응답 구조에 맞게 수정: hits는 배열일 수도 있고 중첩 객체일 수도 있음
      const source = Array.isArray(userDetail.hits) 
        ? userDetail.hits[0]?._source 
        : (userDetail.hits as { hits?: Array<{ _source?: unknown }> })?.hits?.[0]?._source;
      console.log("📥 사용자 소스 데이터:", JSON.stringify(source, null, 2));
    }
  }, [userDetail, selectedUserId]);

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
    <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#191f28]">
            검색 결과 ({data.results.length}개)
          </h2>
          <div className="text-sm text-[#8b95a1] mt-1">
            총 {data.total_hits.toLocaleString()}명 중 {data.results.length}개 표시
          </div>
        </div>
        {allResults.length > 0 && (
          <button
            onClick={handleExportAllCSV}
            className="px-5 py-2.5 bg-[#3182f6] text-white rounded-xl hover:bg-[#1b64da] transition-all duration-200 flex items-center gap-2 text-sm font-semibold shadow-sm hover:shadow-md active:scale-[0.98] shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>전체 데이터 CSV</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {data.results.map((result, index) => {
          return (
            <div
              key={result.user_id}
              className="border border-gray-100 rounded-2xl p-5 md:p-6 hover:shadow-md hover:border-gray-200 transition-all duration-200 bg-white"
            >
              {/* 기본 정보 */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="text-sm font-medium text-[#8b95a1] bg-[#f5f6f8] px-2.5 py-1 rounded-lg">
                      #{index + 1}
                    </span>
                    <span className="text-lg md:text-xl font-bold text-[#191f28]">
                      사용자 ID: <span className="text-[#3182f6]">{result.user_id}</span>
                    </span>
                    <span className="px-3 py-1.5 bg-[#e8f4fd] text-[#3182f6] rounded-xl text-xs md:text-sm font-semibold">
                      점수: {result.score.toFixed(2)}
                    </span>
                  </div>

                  {/* 인구통계 정보 */}
                  {result.demographic_info && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      <div className="bg-[#f5f6f8] rounded-xl p-3">
                        <div className="text-xs text-[#8b95a1] mb-1">연령대</div>
                        <div className="text-sm font-semibold text-[#191f28]">
                          {result.demographic_info.age_group || "미정"}
                        </div>
                      </div>
                      <div className="bg-[#f5f6f8] rounded-xl p-3">
                        <div className="text-xs text-[#8b95a1] mb-1">성별</div>
                        <div className="text-sm font-semibold text-[#191f28]">
                          {result.demographic_info.gender || "미정"}
                        </div>
                      </div>
                      <div className="bg-[#f5f6f8] rounded-xl p-3">
                        <div className="text-xs text-[#8b95a1] mb-1">지역</div>
                        <div className="text-sm font-semibold text-[#191f28]">
                          {result.demographic_info.region || "미정"}
                        </div>
                      </div>
                      <div className="bg-[#f5f6f8] rounded-xl p-3">
                        <div className="text-xs text-[#8b95a1] mb-1">결혼상태</div>
                        <div className="text-sm font-semibold text-[#191f28]">
                          {result.demographic_info.marital_status || "미정"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 행동 정보 */}
                  {result.behaviors_info && (
                    <div className="flex gap-2 mt-4 flex-wrap">
                      <div className="bg-[#fff4e6] border border-[#ffe7ba] rounded-xl px-3 py-2">
                        <span className="text-xs text-[#d97706] font-medium">흡연</span>
                        <span className={`text-sm font-semibold ml-2 ${result.behaviors_info.smoker ? 'text-[#d97706]' : 'text-[#8b95a1]'}`}>
                          {result.behaviors_info.smoker ? "예" : "아니오"}
                        </span>
                      </div>
                      <div className="bg-[#f3e8ff] border border-[#e9d5ff] rounded-xl px-3 py-2">
                        <span className="text-xs text-[#9333ea] font-medium">음주</span>
                        <span className={`text-sm font-semibold ml-2 ${result.behaviors_info.drinker ? 'text-[#9333ea]' : 'text-[#8b95a1]'}`}>
                          {result.behaviors_info.drinker ? "예" : "아니오"}
                        </span>
                      </div>
                      <div className="bg-[#d1fae5] border border-[#a7f3d0] rounded-xl px-3 py-2">
                        <span className="text-xs text-[#059669] font-medium">차량보유</span>
                        <span className={`text-sm font-semibold ml-2 ${result.behaviors_info.has_vehicle ? 'text-[#059669]' : 'text-[#8b95a1]'}`}>
                          {result.behaviors_info.has_vehicle ? "예" : "아니오"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 상세보기 버튼 */}
                <button
                  onClick={() => handleDetailClick(result.user_id)}
                  className="ml-4 flex items-center gap-2 px-4 py-2.5 bg-[#00d084] hover:bg-[#00b875] text-white rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 shadow-sm hover:shadow-md active:scale-[0.98]"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">상세보기</span>
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

