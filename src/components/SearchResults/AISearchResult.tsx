import { Download } from "lucide-react";
import type { ResponseSearchNlDto } from "../../types/search";
import SimpleBarChart from "../common/graph/SimpleBarChart";
import { TOTAL_PANEL_COUNT } from "../../constants/number";

interface AISearchResultProps {
  query: string;
  data: ResponseSearchNlDto;
}

const AISearchResult = ({ query, data }: AISearchResultProps) => {
  const handleExportCSV = () => {
    if (!data.results || data.results.length === 0) return;

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

    const rows = data.results.map((panel) => [
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
    link.download = `검색결과_${query.replace(/[^a-zA-Z0-9가-힣]/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 w-full max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-6 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#191f28]">
            AI 분석 요약
          </h2>
        </div>

        <SimpleBarChart
          title="전체 db에서 매칭된 데이터"
          matchedValue={data.total_hits}
          totalValue={TOTAL_PANEL_COUNT}
        />

        <div className="space-y-6 md:space-y-8">
          <div className="bg-[#f5f6f8] rounded-2xl p-5 md:p-6">
            <p className="text-base md:text-lg text-[#191f28] leading-relaxed">
              <span className="font-bold text-[#191f28]">'{query}'</span>라는
              검색어로 총{" "}
              <span className="font-bold text-[#3182f6]">
                {data.requested_count !== 1000
                  ? data.requested_count
                  : data.total_hits}
                명
              </span>
              의 관련 패널을 찾았습니다.
            </p>
          </div>

          {/* Behavioral Summary */}
          {data.llm_summary?.summary?.behavioral_summary && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6">
              <p className="text-sm md:text-base text-[#4e5968] leading-relaxed">
                {data.llm_summary.summary.behavioral_summary}
              </p>
            </div>
          )}

          {/* Highlights - 불렛 리스트 */}
          {data.llm_summary?.summary?.highlights &&
            data.llm_summary.summary.highlights.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 md:p-6">
                <h3 className="text-sm font-semibold text-[#191f28] mb-4">주요 하이라이트</h3>
                <ul className="space-y-3 text-sm md:text-base text-[#4e5968]">
                  {data.llm_summary.summary.highlights.map((highlight, idx) => (
                    <li key={idx} className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#3182f6] mt-1.5">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* CSV 내보내기 버튼 */}
          <button
            onClick={handleExportCSV}
            className="w-full px-6 py-4 bg-[#3182f6] text-white rounded-2xl hover:bg-[#1b64da] transition-all duration-200 flex items-center justify-center gap-2 text-base font-semibold shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <Download className="w-5 h-5" />
            <span>CSV로 내보내기</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AISearchResult;
