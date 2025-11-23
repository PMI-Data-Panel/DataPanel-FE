import { useState, useEffect } from "react";
import { Tooltip, Cell, ResponsiveContainer, Pie, PieChart } from "recharts";
import type { Distribution } from "../../../types/search";

const INNER_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

const OUTER_COLORS = [
  "#60a5fa",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#8b5cf6",
  "#10b981",
  "#f97316",
  "#06b6d4",
  "#a855f7",
  "#84cc16",
];

const NestedDonutChart = ({
  innerData,
  outerData,
  title,
  onInnerClick,
  onOuterClick,
}: {
  innerData: Distribution[];
  outerData: Distribution[];
  title: string;
  onInnerClick?: (data: Distribution) => void;
  onOuterClick?: (data: Distribution) => void;
}) => {
  // 툴팁
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; payload: Distribution }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs">
          <div className="font-semibold">{data.name}</div>
          <div>비율: {data.payload.percentage.toFixed(2)}%</div>
          <div>인원: {data.payload.value}명</div>
        </div>
      );
    }
    return null;
  };

  // 라벨 렌더링
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderLabel = (props: any) => {
    return `${props.value.toFixed(1)}%`;
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!innerData || innerData.length === 0 || !outerData || outerData.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6" style={{ minWidth: 0, minHeight: 500 }}>
      <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
        {title}
      </h3>
      {isMounted && (
        <div style={{ width: '100%', height: 400, minHeight: 300 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={300} minWidth={0}>
        <PieChart>
          {/* 안쪽 원 - 지역 (region) */}
          <Pie
            data={innerData}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={80}
            paddingAngle={2}
            dataKey="percentage"
            nameKey="label"
            label={renderLabel}
            labelLine={false}
            onClick={(data) => onInnerClick?.(data)}
            cursor="pointer"
          >
            {innerData.map((_, index) => (
              <Cell
                key={`inner-${index}`}
                fill={INNER_COLORS[index % INNER_COLORS.length]}
              />
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
            dataKey="percentage"
            nameKey="label"
            label={renderLabel}
            labelLine={false}
            onClick={(data) => onOuterClick?.(data)}
            cursor="pointer"
          >
            {outerData.map((_, index) => (
              <Cell
                key={`outer-${index}`}
                fill={OUTER_COLORS[index % OUTER_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      </div>
      )}
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
                  style={{
                    backgroundColor: INNER_COLORS[index % INNER_COLORS.length],
                  }}
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
                  style={{
                    backgroundColor: OUTER_COLORS[index % OUTER_COLORS.length],
                  }}
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
