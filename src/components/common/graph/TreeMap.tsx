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
  data: TreeMapData[] | Distribution[];
  title?: string;
  dataKey?: string;
}

// Distribution[] 배열을 TreeMap 형식으로 변환
const convertToTreeMapData = (data: Distribution[]): TreeMapData[] => {
  return [
    {
      name: "root",
      children: data.map((item) => ({
        name: item.label,
        size: item.value,
      })),
    },
  ];
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

  // depth 1만 표시 (실제 데이터)
  if (depth !== 1) return <g />;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
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
  const treeMapData = isDistribution
    ? convertToTreeMapData(data as Distribution[])
    : (data as TreeMapData[]);

  return (
    <div className="bg-blue-50 rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <Treemap
        style={{
          width: "100%",
          maxWidth: "500px",
          maxHeight: "80vh",
          aspectRatio: 4 / 3,
        }}
        data={treeMapData}
        dataKey={dataKey}
        stroke="#fff"
        fill="#8884d8"
        content={CustomizedContent}
      />
    </div>
  );
};

export default TreeMapComponent;
