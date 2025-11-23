import { useState, useEffect } from "react";
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
// 큰 항목의 크기를 제한하여 균형잡힌 시각화 제공
const convertToTreeMapData = (data: Distribution[]): TreeMapData => {
  // 데이터 정렬 (큰 값부터)
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // 전체 합계 계산
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);
  
  // 최대 크기 제한 (전체의 30%를 넘지 않도록)
  const maxSizeRatio = 0.15;
  const maxSize = total * maxSizeRatio;
  
  // 크기 제한을 적용한 데이터 변환
  const processedData = sortedData.map((item) => {
    const originalSize = item.value;
    // 최대 크기를 초과하는 경우 제한 적용
    const limitedSize = originalSize > maxSize ? maxSize : originalSize;
    
    return {
      name: String(item.label),
      size: limitedSize,
      originalSize: originalSize, // 원본 크기 저장 (표시용)
    };
  });
  
  return {
    name: "root",
    children: processedData,
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

  // 텍스트 표시를 위한 조건 계산 (모바일 대응)
  const area = width * height;
  // 모바일 감지 (렌더링 시점에 체크)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  // 모바일과 데스크탑에 따라 다른 기준 적용
  const minAreaForFullText = isMobile ? 1200 : 2000; // 이름 + 숫자 표시를 위한 최소 영역
  const minAreaForNameOnly = isMobile ? 500 : 800; // 이름만 표시를 위한 최소 영역
  const minWidthForText = isMobile ? 30 : 40;
  const minHeightForText = isMobile ? 15 : 20;

  // 텍스트 크기 동적 계산 (모바일 대응)
  const getFontSize = (baseSize: number) => {
    const mobileScale = isMobile ? 0.85 : 1;
    const scale = Math.min(width / 100, height / 50, 1) * mobileScale;
    return Math.max(10, baseSize * scale); // 최소 10px
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
      {/* 텍스트 표시 로직 개선 */}
      {width >= minWidthForText && height >= minHeightForText && area >= minAreaForNameOnly ? (
        area >= minAreaForFullText ? (
          // 큰 영역: 이름 + 숫자 표시
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize={getFontSize(12)}
              fontWeight="600"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize={getFontSize(10)}
              fillOpacity={0.95}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {value?.toLocaleString()}명
            </text>
          </>
        ) : (
          // 작은 영역: 이름만 표시 (더 작은 폰트)
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize={getFontSize(9)}
            fontWeight="600"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
          >
            {name}
          </text>
        )
      ) : (
        // 매우 작은 영역: 툴팁을 위한 제목 속성 추가
        <title>{name}: {value?.toLocaleString()}명</title>
      )}
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
  
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isDistribution && (!data || (data as TreeMapData).children?.length === 0)) {
    return null;
  }

  const treeMapData: TreeMapData = isDistribution
    ? convertToTreeMapData(data as Distribution[])
    : (data as TreeMapData);

  // onItemClick을 전달하는 커스텀 콘텐츠 생성
  const ContentWithClick = (props: TreemapNode) => (
    <CustomizedContent {...props} onItemClick={onItemClick} />
  );

  return (
    <div className="bg-gray-150 rounded-lg shadow-xl p-3 md:p-6 flex flex-col items-center justify-center w-full max-w-full overflow-hidden" style={{ minWidth: 0, minHeight: isMobile ? 400 : 300 }}>
      {title && (
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4">
          {title}
        </h3>
      )}
      {isMounted && (
        <div style={{ width: '100%', height: isMobile ? 400 : 300, minHeight: isMobile ? 350 : 200 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={isMobile ? 350 : 200} minWidth={0}>
          <Treemap
            data={[treeMapData] as unknown as TreeMapData[]}
            dataKey={dataKey}
            stroke="#fff"
            fill="#8884d8"
            content={ContentWithClick as unknown as React.ReactElement}
          />
        </ResponsiveContainer>
      </div>
      )}
    </div>
  );
};

export default TreeMapComponent;
