import { X, Download } from "lucide-react";
import type { SearchNlResults } from "../../types/search";
import TreeMapComponent from "../common/graph/TreeMap";
import type { Distribution } from "../../types/search";

interface ResidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  regionName: string;
  panels: SearchNlResults[];
  residenceData: Distribution[];
  onResidenceClick?: (data: Distribution) => void;
}

const ResidenceModal = ({
  isOpen,
  onClose,
  regionName,
  panels,
  residenceData,
  onResidenceClick,
}: ResidenceModalProps) => {
  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const headers = [
      "ID",
      "나이",
      "출생연도",
      "결혼여부",
      "지역",
      "거주지",
      "설문조사일시",
    ];
    const rows = panels.map((panel) => [
      panel.user_id,
      panel.demographic_info?.age_group || "-",
      panel.demographic_info?.birth_year || "-",
      panel.demographic_info?.marital_status || "-",
      panel.demographic_info?.region || "-",
      panel.demographic_info?.sub_region || "-",
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
    link.download = `패널목록_${regionName}.csv`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full md:w-[90%] lg:w-[70%] max-w-6xl max-h-[90vh] md:max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 md:p-6 border-b gap-3 shrink-0">
          <div>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
              {regionName} 패널 목록
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              총 {panels.length}명
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadCSV}
              className="flex-1 sm:flex-none px-3 py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV로 내려받기</span>
              <span className="sm:hidden">CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {/* 거주지 분포 차트 */}
          {residenceData.length > 0 && (
            <TreeMapComponent
              data={residenceData}
              title={`${regionName} 거주지 분포`}
              onItemClick={onResidenceClick}
            />
          )}

          {/* 패널 목록 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 border-b">
                    ID
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 border-b">
                    나이
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 border-b">
                    출생연도
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 border-b">
                    결혼여부
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 border-b">
                    거주지
                  </th>
                  <th className="px-2 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-semibold text-gray-700 border-b">
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
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 border-b">
                      {panel.user_id}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border-b">
                      {panel.demographic_info?.age_group || "-"}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border-b">
                      {panel.demographic_info?.birth_year || "-"}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border-b">
                      {panel.demographic_info?.marital_status || "-"}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border-b">
                      {panel.demographic_info?.sub_region || "-"}
                    </td>
                    <td className="px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-700 border-b">
                      {panel.survey_datetime
                        ? new Date(panel.survey_datetime).toLocaleString(
                            "ko-KR"
                          )
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidenceModal;

