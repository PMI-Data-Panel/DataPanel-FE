import { useState } from "react";
import { Eye, Download, User } from "lucide-react";
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
          <div className="text-xl md:text-2xl font-bold text-[#191f28]">
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

      {/* 테이블 형식의 사용자 목록 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-4 text-left text-sm font-semibold text-[#191f28]">사용자 ID</th>
              <th className="p-4 text-left text-sm font-semibold text-[#191f28]">연령대</th>
              <th className="p-4 text-left text-sm font-semibold text-[#191f28]">성별</th>
              <th className="p-4 text-left text-sm font-semibold text-[#191f28]">지역</th>
              <th className="p-4 text-left text-sm font-semibold text-[#191f28]">작업</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((result) => {
              return (
                <tr
                  key={result.user_id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-[#191f28] font-medium">
                        {result.user_id}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[#191f28]">
                      {result.demographic_info?.age_group || "미정"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[#191f28]">
                      {result.demographic_info?.gender || "미정"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-[#191f28]">
                      {result.demographic_info?.region || "미정"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDetailClick(result.user_id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d084] hover:bg-[#00b875] text-white rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>상세보기</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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

