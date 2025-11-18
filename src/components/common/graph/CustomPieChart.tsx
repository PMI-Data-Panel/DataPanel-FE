import { Pie, PieChart, Sector, Tooltip } from "recharts";
import type { SectorProps } from "recharts";
import type { TooltipIndex } from "recharts/types/state/tooltipSlice";
import type { Distribution } from "../../../types/search";

type Coordinate = {
  x: number;
  y: number;
};

type PieSectorData = {
  percent?: number;
  name?: string | number;
  midAngle?: number;
  middleRadius?: number;
  tooltipPosition?: Coordinate;
  value?: number;
  paddingAngle?: number;
  dataKey?: string;
  payload?: Distribution;
};

type PieSectorDataItem = React.SVGProps<SVGPathElement> &
  Partial<SectorProps> &
  PieSectorData;

interface CustomPieChartProps {
  data: Distribution[];
  isAnimationActive?: boolean;
  defaultIndex?: TooltipIndex;
  title?: string;
  innerRadius?: string;
  outerRadius?: string;
}

// 색상 팔레트 (5가지)
const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
];

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload?.label}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >
        {`${value}명`}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${((percent ?? 1) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const CustomPieChart = ({
  data,
  isAnimationActive = true,
  defaultIndex = undefined,
  title,
  innerRadius = "60%",
  outerRadius = "80%",
}: CustomPieChartProps) => {
  // 각 데이터에 색상 추가
  const dataWithColors = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-gray-100 rounded-xl flex flex-col items-center justify-center">
      {title && (
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          &lt; {title} &gt;
        </h3>
      )}
      <PieChart
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "80vh",
          aspectRatio: 1,
        }}
        margin={{
          top: 0,
          right: 100,
          bottom: 0,
          left: 100,
        }}
      >
        <Pie
          activeShape={renderActiveShape}
          data={dataWithColors}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          isAnimationActive={isAnimationActive}
        />
        <Tooltip content={() => null} defaultIndex={defaultIndex} />
      </PieChart>
    </div>
  );
};

export default CustomPieChart;
