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

// 현대적이고 조화로운 색상 팔레트 (더 세련되고 일관된 색상)
const COLORS = [
  "#4f46e5", // 인디고 블루
  "#7c3aed", // 바이올렛
  "#ec4899", // 핑크
  "#f97316", // 오렌지
  "#14b8a6", // 틸
  "#6366f1", // 인디고
  "#f43f5e", // 로즈
  "#10b981", // 에메랄드
  "#8b5cf6", // 퍼플
  "#06b6d4", // 시안
  "#f59e0b", // 앰버
  "#ef4444", // 레드
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

  // 호버 효과를 위한 상태 (간단한 구현)
  const colorIndex = (index || 0) % COLORS.length;
  const baseColor = COLORS[colorIndex];
  
  // 색상 밝기 계산 (더 어두운 버전)
  const getDarkerColor = (color: string) => {
    // 간단한 어두운 버전 생성
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 20);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 20);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 20);
    return `rgb(${r}, ${g}, ${b})`;
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
        rx={6}
        ry={6}
        style={{
          fill: baseColor,
          stroke: "#fff",
          strokeWidth: 2.5,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
        }}
      />
      {/* 텍스트 표시 로직 개선 - 중앙 정렬 */}
      {width >= minWidthForText && height >= minHeightForText && area >= minAreaForNameOnly ? (
        area >= minAreaForFullText ? (
          // 큰 영역: 이름 + 숫자 표시 (중앙 정렬)
          <>
            <text
              x={x + width / 2}
              y={y + height / 2 - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize={getFontSize(14)}
              fontWeight="600"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {name}
            </text>
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              fontSize={getFontSize(11)}
              fillOpacity={0.95}
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {value?.toLocaleString()}명
            </text>
          </>
        ) : (
          // 작은 영역: 이름만 표시 (중앙 정렬)
          <text
            x={x + width / 2}
            y={y + height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#fff"
            fontSize={getFontSize(10)}
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
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
    <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 w-full max-w-full overflow-hidden border border-gray-100 flex flex-col" style={{ minWidth: 0, minHeight: isMobile ? 400 : 320 }}>
      {title && (
        <div className="flex items-center justify-center gap-2 mb-3 md:mb-4 shrink-0">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <h3 className="text-sm md:text-base font-bold text-gray-800 text-center">
            {title}
          </h3>
        </div>
      )}
      <div style={{ width: '100%', height: isMobile ? 360 : 280, minHeight: isMobile ? 360 : 280 }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={isMobile ? 360 : 280} minWidth={0}>
          <Treemap
            data={[treeMapData] as unknown as TreeMapData[]}
            dataKey={dataKey}
            stroke="#fff"
            fill="#8884d8"
            content={ContentWithClick as unknown as React.ReactElement}
            isAnimationActive={false}
          />
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TreeMapComponent;
