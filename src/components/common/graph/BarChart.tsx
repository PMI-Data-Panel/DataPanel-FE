import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { Distribution } from "../../../types/search";

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#f97316",
  "#6366f1",
];

const BarChart = ({
  data,
  title,
  onBarClick,
}: {
  data?: Distribution[];
  title: string;
  onBarClick?: (data: Distribution) => void;
}) => {
  // 툴팁
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: Distribution }>;
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs">
          <div className="font-semibold">{item.label}</div>
          <div>비율: {item.percentage.toFixed(2)}%</div>
          <div>인원: {item.value}명</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-3 md:p-6 w-full max-w-full overflow-hidden">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-6 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
          <YAxis
            dataKey="label"
            type="category"
            width={50}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Bar
            dataKey="percentage"
            radius={[0, 8, 8, 0]}
            cursor="pointer"
            onClick={(item: { payload?: Distribution }) => {
              if (item.payload) {
                onBarClick?.(item.payload);
              }
            }}
          >
            {data?.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-center">
        <span className="text-xs text-gray-500">패널 수 (%)</span>
      </div>
    </div>
  );
};

export default BarChart;
