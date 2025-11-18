import { X, Download } from "lucide-react";
import type { SearchNlResults } from "../../types/search";

interface PanelListModalProps {
  isOpen: boolean;
  onClose: () => void;
  panels: SearchNlResults[];
  filterLabel: string;
  filterType: string;
}

const PanelListModal = ({
  isOpen,
  onClose,
  panels,
  filterLabel,
  filterType,
}: PanelListModalProps) => {
  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const headers = [
      "ID",
      "나이",
      "출생연도",
      "결혼여부",
      "지역",
      "설문조사일시",
    ];
    const rows = panels.map((panel) => [
      panel.user_id,
      panel.demographic_info.age_group || "-",
      panel.demographic_info.birth_year || "-",
      panel.demographic_info.marital_status || "-",
      `${panel.demographic_info.region || "-"} ${
        panel.demographic_info.sub_region || ""
      }`.trim(),
      panel.survey_datetime || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `패널목록_${filterLabel}.csv`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-[70%] max-w-6xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              '{filterLabel}' 패널 목록
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filterType} • 총 {panels.length}명
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV로 내려받기
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 테이블 */}
        <div className="flex-1 overflow-auto p-6">
          <table className="w-full border-collapse">
            <thead className=" bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  나이
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  출생연도
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  결혼여부
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  지역
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  설문조사일시
                </th>
              </tr>
            </thead>
            <tbody>
              {panels.map((panel, index) => (
                <tr
                  key={panel.user_id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 border-b">
                    {panel.user_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {panel.demographic_info.age_group || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {panel.demographic_info.birth_year || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {panel.demographic_info.marital_status || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {panel.demographic_info.region || "-"}{" "}
                    {panel.demographic_info.sub_region || ""}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 border-b">
                    {panel.survey_datetime
                      ? new Date(panel.survey_datetime).toLocaleString("ko-KR")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PanelListModal;
