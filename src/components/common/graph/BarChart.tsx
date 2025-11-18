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
  // 데이터 정렬 함수
  const sortData = (data?: Distribution[]) => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      const aLabel = a.label;
      const bLabel = b.label;

      // 연령대 정렬 (0대, 10대, 20대, ..., 100대)
      if (aLabel.includes("대") && bLabel.includes("대")) {
        const aAge = parseInt(aLabel);
        const bAge = parseInt(bLabel);
        return aAge - bAge;
      }

      // 가족수 정렬 (1명, 2명, ..., 5명)
      if (aLabel.includes("명") && bLabel.includes("명")) {
        const aNum = parseInt(aLabel);
        const bNum = parseInt(bLabel);
        return aNum - bNum;
      }

      // 기본 정렬
      return 0;
    });
  };

  const sortedData = sortData(data);

  // X축 도메인 계산 (최소값과 최대값 기반)
  const getXDomain = (): [number, number] => {
    if (!sortedData || sortedData.length === 0) return [0, 100];

    const percentages = sortedData.map(d => d.percentage);
    const minPercentage = Math.min(...percentages);
    const maxPercentage = Math.max(...percentages);

    // 최소값에서 여유를 두고 시작 (더 차이가 잘 보이도록)
    const range = maxPercentage - minPercentage;

    // range가 0이면 (모든 값이 같거나 하나의 항목만 있을 때) 고정 범위 사용
    if (range === 0) {
      return [0, 100];
    }

    const padding = range * 0.1; // 10% 패딩

    const domainMin = Math.max(0, Math.floor(minPercentage - padding));
    const domainMax = Math.ceil(maxPercentage + padding);

    return [domainMin, domainMax];
  };

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
    <div className="bg-gray-150 rounded-lg shadow-xl p-3 md:p-6 w-full max-w-full overflow-hidden">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-6 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsBarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={getXDomain()} tick={{ fontSize: 12 }} />
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
            {sortedData?.map((_, index) => (
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
