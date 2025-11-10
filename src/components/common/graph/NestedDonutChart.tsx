import { Tooltip, Cell, ResponsiveContainer, Pie, PieChart } from "recharts";
import type { BarData } from "../../../types/graph";

const NestedDonutChart = ({
  innerData,
  outerData,
  title,
}: {
  innerData: BarData[];
  outerData: BarData[];
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
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          {/* 안쪽 원 - 지역 (region) */}
          <Pie
            data={innerData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="label"
            label={renderLabel}
            labelLine={false}
          >
            {innerData.map((entry, index) => (
              <Cell key={`inner-${index}`} fill={entry.color} />
            ))}
          </Pie>
          {/* 바깥쪽 원 - 거주지 (sub_region) */}
          <Pie
            data={outerData}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={140}
            paddingAngle={1}
            dataKey="value"
            nameKey="label"
            label={renderLabel}
            labelLine={false}
          >
            {outerData.map((entry, index) => (
              <Cell key={`outer-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* 레전드 */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* 지역 레전드 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
            지역 (안쪽)
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {innerData.map((entry, index) => (
              <div
                key={`inner-legend-${index}`}
                className="flex items-center gap-1"
              >
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600">{entry.label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 거주지 레전드 */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2 text-center">
            거주지 (바깥쪽)
          </h4>
          <div className="flex flex-wrap justify-center gap-2">
            {outerData.slice(0, 10).map((entry, index) => (
              <div
                key={`outer-legend-${index}`}
                className="flex items-center gap-1"
              >
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600">{entry.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NestedDonutChart;
