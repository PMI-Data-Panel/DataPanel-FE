import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";
import type { Distribution } from "../../../types/search";

interface PieChartComponentProps {
  data: Distribution[];
  title?: string;
  isAnimationActive?: boolean;
  colors?: string[];
}

const RADIAN = Math.PI / 180;

// 기본 색상 팔레트
const DEFAULT_COLORS = [
  "#6FA3E3", // blue
  "#745AE6", // purple
  "#E55D59", // red
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
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
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
      className="font-semibold text-sm"
    >
      <tspan x={x} dy="-0.5em">
        {name}
      </tspan>
      <tspan x={x} dy="1.2em">
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
}: PieChartComponentProps) => {
  const palette = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
  return (
    <div className="bg-gray-150 shadow-xl rounded-lg p-3 md:p-6 flex flex-col items-center justify-center w-full max-w-full">
      {title && (
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={300} maxHeight={500}>
        <PieChart>
          <Pie
            data={data}
            labelLine={false}
            label={renderCustomizedLabel}
            fill="#8884d8"
            dataKey="value"
            nameKey="label"
            isAnimationActive={isAnimationActive}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.label}`}
                fill={palette[index % palette.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
