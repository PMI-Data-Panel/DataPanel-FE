import { Treemap } from "recharts";
import type { TreemapNode } from "recharts/types/chart/Treemap";
import type { Distribution } from "../../../types/search";

interface TreeMapData {
  name: string;
  size?: number;
  children?: TreeMapData[];
  [key: string]: string | number | TreeMapData[] | undefined;
}

interface TreeMapComponentProps {
  data: TreeMapData | Distribution[];
  title?: string;
  dataKey?: string;
}

// Distribution[] 배열을 TreeMap 형식으로 변환
const convertToTreeMapData = (data: Distribution[]): TreeMapData => {
  return {
    name: "root",
    children: data.map((item) => ({
      name: String(item.label),
      size: item.value,
    })),
  };
};

const COLORS = [
  "#3b82f6", // blue-500
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
];

const CustomizedContent = (props: TreemapNode) => {
  const { depth, x, y, width, height, index, name, value } = props;

  // root depth는 표시하지 않음
  if (depth === 0) return null;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[(index || 0) % COLORS.length],
          stroke: "#fff",
          strokeWidth: 2,
        }}
      />
      {/* 영역이 충분히 클 때만 텍스트 표시 */}
      {width > 50 && height > 35 ? (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 5}
            textAnchor="middle"
            fill="#fff"
            fontSize={13}
            fontWeight="600"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="#fff"
            fontSize={11}
            fillOpacity={0.9}
          >
            {value?.toLocaleString()}명
          </text>
        </>
      ) : width > 30 && height > 20 ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
          fontWeight="600"
        >
          {name}
        </text>
      ) : null}
    </g>
  );
};

const TreeMapComponent = ({
  data,
  title,
  dataKey = "size",
}: TreeMapComponentProps) => {
  // Distribution 타입인지 확인하고 변환
  const isDistribution =
    Array.isArray(data) && data.length > 0 && "label" in data[0];
  const treeMapData: TreeMapData = isDistribution
    ? convertToTreeMapData(data as Distribution[])
    : (data as TreeMapData);

  return (
    <div className="bg-gray-150 rounded-lg shadow-xl p-3 md:p-6 flex flex-col items-center justify-center w-full max-w-full overflow-hidden">
      {title && (
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4">
          {title}
        </h3>
      )}
      <div className="w-full h-full flex items-center justify-center">
        <Treemap
          width={600}
          height={400}
          data={[treeMapData] as unknown as TreeMapData[]}
          dataKey={dataKey}
          stroke="#fff"
          fill="#8884d8"
          content={CustomizedContent as unknown as React.ReactElement}
        />
      </div>
    </div>
  );
};

export default TreeMapComponent;
