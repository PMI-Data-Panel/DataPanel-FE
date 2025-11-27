import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { Distribution } from "../../../types/search";

interface PieChartComponentProps {
  data: Distribution[];
  title?: string;
  isAnimationActive?: boolean;
  colors?: string[];
  onItemClick?: (data: Distribution) => void;
}

const RADIAN = Math.PI / 180;

const DEFAULT_COLORS = [
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#06b6d4", // cyan-500
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: PieLabelRenderProps) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }
  const ncx = Number(cx);
  const ncy = Number(cy);

  // 레이블을 파이 조각의 중앙에 배치
  const radius =
    Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.5;
  const labelX = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const labelY = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={labelX}
      y={labelY}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      className="font-semibold"
      style={{ fontSize: "12px", pointerEvents: "none" }}
    >
      <tspan x={labelX} dy="-0.3em">
        {name}
      </tspan>
      <tspan x={labelX} dy="1.1em" style={{ fontSize: "11px" }}>
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </tspan>
    </text>
  );
};

const PieChartComponent = ({
  data,
  title,
  isAnimationActive = true,
  colors,
  onItemClick,
}: PieChartComponentProps) => {
  const palette = colors && colors.length > 0 ? colors : DEFAULT_COLORS;

  if (!data || data.length === 0) {
    return null;
  }

  const handleClick = (entry: Distribution) => {
    if (onItemClick) {
      onItemClick(entry);
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-3 md:p-4 w-full max-w-full overflow-hidden border border-gray-100 flex flex-col"
      style={{ minWidth: 0, minHeight: 320 }}
    >
      {title && (
        <div className="flex items-center justify-center gap-2 mb-3 md:mb-4 shrink-0">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-sm md:text-base font-bold text-gray-800 text-center">
            {title}
          </h3>
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: 280,
          minHeight: 280,
          flex: 1,
          padding: "0 1rem",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
          minHeight={280}
          minWidth={0}
        >
          <PieChart>
            <Pie
              data={data}
              labelLine={false}
              label={renderCustomizedLabel}
              fill="#8884d8"
              dataKey="value"
              nameKey="label"
              isAnimationActive={isAnimationActive}
              cx="50%"
              cy="50%"
              outerRadius={90}
              onClick={(entry: Distribution) => handleClick(entry)}
              style={{ cursor: onItemClick ? "pointer" : "default" }}
              activeShape={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${entry.label}-${index}`}
                  fill={palette[index % palette.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PieChartComponent;
