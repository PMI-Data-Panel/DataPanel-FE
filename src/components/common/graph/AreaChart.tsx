import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Distribution } from "../../../types/search";

interface AreaChartComponentProps {
  data: Distribution[];
  title?: string;
  dataKey?: string;
  xAxisKey?: string;
  color?: string;
  areaType?: "monotone" | "linear" | "step";
  onItemClick?: (data: Distribution) => void;
}

const AreaChartComponent = ({
  data,
  title,
  dataKey = "value",
  xAxisKey = "label",
  color = "#3b82f6",
  areaType = "monotone",
  onItemClick,
}: AreaChartComponentProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-full overflow-hidden" style={{ minWidth: 0, minHeight: 300 }}>
      {title && (
        <div className="flex items-center justify-center gap-2 mb-3 md:mb-4 shrink-0 px-4 pt-4">
          <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
          <h3 className="text-base md:text-lg font-semibold text-gray-800 tracking-tight">
            {title}
          </h3>
        </div>
      )}
      {isMounted && (
        <div style={{ width: '100%', height: 300, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={200} minWidth={0}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
          <defs>
            <linearGradient id={`areaGradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#6b7280"
            style={{ fontSize: "11px" }}
            angle={-15}
            textAnchor="end"
            height={60}
          />
          <YAxis width={50} stroke="#6b7280" style={{ fontSize: "11px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "0.75rem",
              padding: "12px 16px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              fontSize: "12px",
            }}
            labelStyle={{
              color: "#1f2937",
              fontWeight: 600,
              marginBottom: "8px",
            }}
          />
          <Area
            type={areaType}
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#areaGradient-${color.replace('#', '')})`}
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
      )}
      {/* 클릭 가능한 지역 목록 */}
      {onItemClick && data.length > 0 && (
        <div className="px-4 pb-4 pt-2">
          <div className="flex flex-wrap gap-2 justify-center">
            {data.map((item, index) => (
              <button
                key={index}
                onClick={() => onItemClick(item)}
                className="px-3 py-1.5 text-xs md:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors cursor-pointer"
                title={`${item.label}: ${item.value}명 (${item.percentage}%)`}
              >
                {item.label} ({item.value})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AreaChartComponent;
