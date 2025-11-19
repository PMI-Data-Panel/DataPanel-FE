import { Treemap, ResponsiveContainer } from "recharts";
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
  onItemClick?: (item: Distribution) => void;
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
  "#E8765D", // 주황
  "#5DA0E8", // 파랑
  "#EA7B86", // 분홍
  "#5DE871", // 초록
  "#E8CB5D", // 노랑
  "#E85DB0", // 분홍 2
  "#905DE8", // 보라
  "#D6E8C8", // 초록 2
];

interface CustomizedContentProps extends TreemapNode {
  onItemClick?: (item: Distribution) => void;
}

const CustomizedContent = (props: CustomizedContentProps) => {
  const { depth, x, y, width, height, index, name, value, onItemClick } = props;

  // root depth는 표시하지 않음
  if (depth === 0) return null;

  const handleClick = () => {
    if (onItemClick && name && value !== undefined) {
      onItemClick({ label: name, value: value as number, percentage: 0 });
    }
  };

  return (
    <g
      onClick={handleClick}
      style={{ cursor: onItemClick ? "pointer" : "default" }}
    >
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
  onItemClick,
}: TreeMapComponentProps) => {
  // Distribution 타입인지 확인하고 변환
  const isDistribution =
    Array.isArray(data) && data.length > 0 && "label" in data[0];
  const treeMapData: TreeMapData = isDistribution
    ? convertToTreeMapData(data as Distribution[])
    : (data as TreeMapData);

  // onItemClick을 전달하는 커스텀 콘텐츠 생성
  const ContentWithClick = (props: TreemapNode) => (
    <CustomizedContent {...props} onItemClick={onItemClick} />
  );

  return (
    <div className="bg-gray-150 rounded-lg shadow-xl p-3 md:p-6 flex flex-col items-center justify-center w-full max-w-full overflow-hidden">
      {title && (
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4">
          {title}
        </h3>
      )}
      <div className="w-full h-[250px] md:h-[300px] lg:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={[treeMapData] as unknown as TreeMapData[]}
            dataKey={dataKey}
            stroke="#fff"
            fill="#8884d8"
            content={ContentWithClick as unknown as React.ReactElement}
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TreeMapComponent;
