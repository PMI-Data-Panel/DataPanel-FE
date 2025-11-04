import React from "react";
import { ChevronDown } from "lucide-react";

interface ResultsHeaderProps {
  count: number;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ count }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{count}개 응답</h3>
      <div className="flex gap-3">
        <button className="flex items-center gap-2">
          정확도순 <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2">Excel</button>
        <button className="flex items-center gap-2">JSON</button>
      </div>
    </div>
  );
};

export default ResultsHeader;
