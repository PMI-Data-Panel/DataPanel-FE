import { Tooltip, Cell, ResponsiveContainer, Pie, PieChart } from "recharts";
import type { BarData } from "../../../types/graph";

const DonutChart = ({
  chartData,
  title,
}: {
  chartData: BarData[];
  title: string;
}) => {
  // 툴팁
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: BarData }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs">
          <div className="font-semibold">{data.name}</div>
          <div>비율: {data.value}%</div>
          <div>인원: {data.payload.count}명</div>
        </div>
      );
    }
    return null;
  };

  // 커스텀 레전드
  const CustomLegend = () => {
    return (
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-700">{entry.label}</span>
          </div>
        ))}
      </div>
    );
  };

  // 라벨 렌더링
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (props: any) => {
    return `${props.value}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="label"
            label={renderLabel}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <CustomLegend />
    </div>
  );
};

export default DonutChart;
