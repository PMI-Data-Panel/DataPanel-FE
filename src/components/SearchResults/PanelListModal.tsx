import { Download } from "lucide-react";
import type { SearchNlResults } from "../../types/search";
import Modal from "../common/Modal";

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
      panel.demographic_info?.age_group || "-",
      panel.demographic_info?.birth_year || "-",
      panel.demographic_info?.marital_status || "-",
      `${panel.demographic_info?.region || "-"} ${
        panel.demographic_info?.sub_region || ""
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
  
  const title = `'${filterLabel}' 패널 목록 (${filterType} • 총 ${panels.length}명)`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-6xl">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Download className="w-4 h-4" />
          <span>CSV로 내려받기</span>
        </button>
      </div>
      <div className="overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="bg-gray-50 sticky top-0">
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
                  <td className="px-4 py-2 text-sm text-gray-900 border-b">
                    {panel.user_id}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b">
                    {panel.demographic_info?.age_group || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b">
                    {panel.demographic_info?.birth_year || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b">
                    {panel.demographic_info?.marital_status || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b">
                    {panel.demographic_info?.region || "-"}{" "}
                    {panel.demographic_info?.sub_region || ""}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700 border-b">
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
    </Modal>
  );
};

export default PanelListModal;
