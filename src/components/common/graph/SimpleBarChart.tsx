import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";

interface SimpleBarChartProps {
  title: string;
  matchedValue: number;
  totalValue: number;
  matchedLabel?: string;
  unmatchedLabel?: string;
  matchedColor?: string;
  unmatchedColor?: string;
}

const SimpleBarChart = ({
  title,
  matchedValue,
  totalValue,
  matchedLabel = "매칭",
  unmatchedLabel = "미매칭",
  matchedColor = "#10b981",
  unmatchedColor = "#d1d5db",
}: SimpleBarChartProps) => {
  const matchedPercentage = (matchedValue / totalValue) * 100;
  const unmatchedPercentage = 100 - matchedPercentage;

  const data = [
    {
      name: "데이터",
      matched: matchedPercentage,
      unmatched: unmatchedPercentage,
      matchedValue,
      unmatchedValue: totalValue - matchedValue,
    },
  ];

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        matchedValue: number;
        unmatchedValue: number;
        matched: number;
        unmatched: number;
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white px-3 py-2 rounded shadow-lg text-xs">
          <div className="mb-1">
            <span className="font-semibold">{matchedLabel}: </span>
            {item.matchedValue.toLocaleString()}명 ({item.matched.toFixed(1)}%)
          </div>
          <div>
            <span className="font-semibold">{unmatchedLabel}: </span>
            {item.unmatchedValue.toLocaleString()}명 (
            {item.unmatched.toFixed(1)}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-150 rounded-lg p-3 md:p-6 w-full max-w-full overflow-hidden">
      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-6 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={60}>
        <RechartsBarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          <Bar dataKey="matched" stackId="stack" radius={[8, 0, 0, 8]}>
            <Cell fill={matchedColor} />
          </Bar>
          <Bar dataKey="unmatched" stackId="stack" radius={[0, 8, 8, 0]}>
            <Cell fill={unmatchedColor} />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: matchedColor }}
          />
          <span className="text-gray-600">
            {matchedLabel}: {matchedValue.toLocaleString()}명 (
            {matchedPercentage.toFixed(1)}%)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded"
            style={{ backgroundColor: unmatchedColor }}
          />
          <span className="text-gray-600">
            {unmatchedLabel}: {(totalValue - matchedValue).toLocaleString()}명 (
            {unmatchedPercentage.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimpleBarChart;
