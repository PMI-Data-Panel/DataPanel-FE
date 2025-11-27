import { useState, useEffect } from "react";
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
  "url(#gradient-blue)",
  "url(#gradient-emerald)",
  "url(#gradient-purple)",
  "url(#gradient-teal)",
  "url(#gradient-indigo)",
  "url(#gradient-cyan)",
  "url(#gradient-rose)",
  "url(#gradient-amber)",
];

const BarChart = ({
  data,
  title,
  onBarClick,
  scrollable = false,
  maxScrollHeight = 600,
  customHeight,
}: {
  data?: Distribution[];
  title: string;
  onBarClick?: (data: Distribution) => void;
  scrollable?: boolean;
  maxScrollHeight?: number;
  customHeight?: number;
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

      return 0;
    });
  };

  const sortedData = sortData(data);

  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!sortedData || sortedData.length === 0) {
    return null;
  }

  // X축 도메인 계산 (최소값과 최대값 기반)
  const getXDomain = (): [number, number] => {
    if (!sortedData || sortedData.length === 0) return [0, 100];

    const percentages = sortedData.map((d) => d.percentage);
    const maxPercentage = Math.max(...percentages);

    // 최대값의 110%까지 표시하여 여유 공간 확보
    const domainMax = Math.ceil(maxPercentage * 1.1);

    // 최소값은 항상 0부터 시작
    return [0, Math.max(domainMax, 10)]; // 최소 10%는 표시
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
        <div className="bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl text-xs border border-gray-200">
          <div className="font-semibold mb-2 text-sm text-gray-900">
            {item.label}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">비율: </span>
              <span className="text-gray-900 font-semibold">
                {item.percentage.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">인원: </span>
              <span className="text-gray-900 font-semibold">
                {item.value.toLocaleString()}명
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // YAxis width 계산 (라벨 길이에 따라 동적 조정)
  const getYAxisWidth = () => {
    if (!sortedData || sortedData.length === 0) return 50;
    const maxLabelLength = Math.max(...sortedData.map((d) => d.label.length));
    // 최소 45px, 최대 70px, 라벨 길이에 따라 조정
    return Math.min(Math.max(maxLabelLength * 6, 45), 70);
  };

  const chartHeight = customHeight ? customHeight + 80 : isMobile ? 320 : 240;
  const chartAreaHeight = customHeight ? customHeight : isMobile ? 280 : 180;

  // 스크롤 가능한 경우 높이 계산
  // 각 바 항목당 약 50px 높이 (라벨 + 바 + 여백)
  const itemHeight = 50;
  const totalChartHeight = sortedData.length * itemHeight;
  const containerMaxHeight = scrollable ? maxScrollHeight : undefined;
  const containerHeight = scrollable
    ? Math.min(totalChartHeight, maxScrollHeight)
    : chartAreaHeight;

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-3 md:p-4 w-full max-w-full overflow-hidden border border-gray-100 flex flex-col"
      style={{ minWidth: 0, minHeight: scrollable ? undefined : chartHeight }}
    >
      <div className="flex items-center justify-center gap-2 mb-3 md:mb-4 shrink-0">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <h3 className="text-sm md:text-base font-bold text-gray-800 text-center">
          {title}
        </h3>
      </div>
      {isMounted && (
        <div
          className={scrollable ? "overflow-y-auto overflow-x-hidden" : ""}
          style={{
            width: "100%",
            height: containerHeight,
            minHeight: scrollable ? undefined : chartAreaHeight,
            maxHeight: containerMaxHeight,
            flex: scrollable ? 0 : 1,
            scrollBehavior: scrollable ? "smooth" : "auto",
          }}
        >
          <ResponsiveContainer
            width="100%"
            height={scrollable ? totalChartHeight : "100%"}
            minHeight={scrollable ? totalChartHeight : chartAreaHeight}
            minWidth={0}
          >
            <RechartsBarChart
              data={sortedData}
              layout="vertical"
              margin={{
                top: 10,
                right: getYAxisWidth() - 10,
                left: getYAxisWidth() - 10,
                bottom: 15,
              }}
            >
              <defs>
                {/* 그라데이션 정의 */}
                <linearGradient id="gradient-blue" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient
                  id="gradient-purple"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={1} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradient-pink" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient
                  id="gradient-orange"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradient-teal" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient
                  id="gradient-indigo"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradient-rose" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fb7185" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient
                  id="gradient-emerald"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradient-cyan" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={1} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="gradient-amber" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#e5e7eb"
              />
              <XAxis
                type="number"
                domain={getXDomain()}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={{ stroke: "#d1d5db" }}
                tickMargin={5}
              />
              <YAxis
                dataKey="label"
                type="category"
                width={getYAxisWidth()}
                tick={{ fontSize: 10, fill: "#6b7280" }}
                axisLine={{ stroke: "#d1d5db" }}
                tickMargin={8}
                interval={0}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Bar
                dataKey="percentage"
                radius={[0, 12, 12, 0]}
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
                    style={{
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    }}
                  />
                ))}
              </Bar>
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BarChart;
