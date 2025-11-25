import type { Distribution } from "../../../types/search";

interface GenderChartProps {
  data?: Distribution[];
  title: string;
  onItemClick?: (data: Distribution) => void;
}

const GenderChart = ({ data, title, onItemClick }: GenderChartProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  // 남성, 여성, 미정 데이터 찾기
  const maleData = data.find((item) => item.label === "남" || item.label === "남성" || item.label === "M" || item.label === "Male");
  const femaleData = data.find((item) => item.label === "여" || item.label === "여성" || item.label === "F" || item.label === "Female");
  const unknownData = data.find((item) => 
    item.label === "미정" || 
    item.label === "알 수 없음" || 
    item.label === "Unknown" ||
    item.label === "기타"
  );

  const malePercentage = maleData?.percentage || 0;
  const femalePercentage = femaleData?.percentage || 0;
  const unknownPercentage = unknownData?.percentage || 0;

  const handleClick = (genderData: Distribution | undefined) => {
    if (genderData && onItemClick) {
      onItemClick(genderData);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 w-full max-w-full overflow-hidden border border-gray-100">
      <h3 className="text-sm md:text-base font-bold text-gray-800 mb-3 md:mb-4 text-center">
        {title}
      </h3>
      
      <div className="flex items-center justify-center gap-6 md:gap-8 lg:gap-10 mb-4 flex-wrap">
        {/* 남성 아이콘 - 항상 표시 */}
        <div 
          className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 flex-1 min-w-0"
          style={{ maxWidth: '120px' }}
          onClick={() => handleClick(maleData)}
        >
          <div className="relative mb-2">
            <svg width="80" height="120" viewBox="0 0 80 120" className="w-20 h-30 md:w-24 md:h-36">
              {/* 남성 아이콘 전체 (회색) */}
              <g fill="#9ca3af">
                {/* 머리 */}
                <circle cx="40" cy="20" r="12" />
                {/* 몸통 */}
                <rect x="32" y="32" width="16" height="30" rx="2" />
                {/* 팔 */}
                <rect x="20" y="35" width="8" height="24" rx="4" />
                <rect x="52" y="35" width="8" height="24" rx="4" />
                {/* 다리 (하반신) */}
                <rect x="30" y="62" width="10" height="40" rx="5" />
                <rect x="40" y="62" width="10" height="40" rx="5" />
              </g>
              
              {/* 전체 아이콘 색상 채우기 (틸/라이트 블루) - 퍼센트에 따라 아래에서 위로 채움 */}
              {malePercentage > 0 && (
                <>
                  <defs>
                    {/* 전체 아이콘 영역 clipPath */}
                    <clipPath id={`male-full-clip-${malePercentage}`}>
                      {/* 머리 */}
                      <circle cx="40" cy="20" r="12" />
                      {/* 몸통 */}
                      <rect x="32" y="32" width="16" height="30" rx="2" />
                      {/* 팔 */}
                      <rect x="20" y="35" width="8" height="24" rx="4" />
                      <rect x="52" y="35" width="8" height="24" rx="4" />
                      {/* 다리 */}
                      <rect x="30" y="62" width="10" height="40" rx="5" />
                      <rect x="40" y="62" width="10" height="40" rx="5" />
                    </clipPath>
                    {/* 채워지는 영역 clipPath - 아래에서 위로 */}
                    <clipPath id={`male-fill-clip-${malePercentage}`}>
                      <rect 
                        x="0" 
                        y={120 - (120 * (malePercentage / 100))} 
                        width="80" 
                        height={120 * (malePercentage / 100)} 
                      />
                    </clipPath>
                  </defs>
                  <g fill="#14b8a6" clipPath={`url(#male-full-clip-${malePercentage})`}>
                    {/* 전체 아이콘 영역을 채우는 rect */}
                    <rect 
                      x="0" 
                      y={120 - (120 * (malePercentage / 100))} 
                      width="80" 
                      height={120 * (malePercentage / 100)} 
                      clipPath={`url(#male-fill-clip-${malePercentage})`}
                      style={{ transition: 'all 0.5s ease' }}
                    />
                  </g>
                </>
              )}
            </svg>
          </div>
          <div className={`text-lg md:text-xl font-bold mb-1 ${malePercentage > 0 ? 'text-[#14b8a6]' : 'text-gray-500'}`}>
            {malePercentage.toFixed(0)}%
          </div>
          <div className="text-sm md:text-base text-gray-700 font-medium">남</div>
        </div>

        {/* 여성 아이콘 - 항상 표시 */}
        <div 
          className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 flex-1 min-w-0"
          style={{ maxWidth: '120px' }}
          onClick={() => handleClick(femaleData)}
        >
          <div className="relative mb-2">
            <svg width="80" height="120" viewBox="0 0 80 120" className="w-20 h-30 md:w-24 md:h-36">
              {/* 여성 아이콘 전체 (회색) */}
              <g fill="#9ca3af">
                {/* 머리 */}
                <circle cx="40" cy="20" r="12" />
                {/* 몸통 */}
                <rect x="32" y="32" width="16" height="30" rx="2" />
                {/* 팔 */}
                <rect x="20" y="35" width="8" height="24" rx="4" />
                <rect x="52" y="35" width="8" height="24" rx="4" />
                {/* 스커트 (하반신) */}
                <path d="M 25 62 L 40 80 L 55 62 L 55 100 L 25 100 Z" />
              </g>
              
              {/* 전체 아이콘 색상 채우기 (빨간색) - 퍼센트에 따라 아래에서 위로 채움 */}
              {femalePercentage > 0 && (
                <>
                  <defs>
                    {/* 전체 아이콘 영역 clipPath */}
                    <clipPath id={`female-full-clip-${femalePercentage}`}>
                      {/* 머리 */}
                      <circle cx="40" cy="20" r="12" />
                      {/* 몸통 */}
                      <rect x="32" y="32" width="16" height="30" rx="2" />
                      {/* 팔 */}
                      <rect x="20" y="35" width="8" height="24" rx="4" />
                      <rect x="52" y="35" width="8" height="24" rx="4" />
                      {/* 스커트 */}
                      <path d="M 25 62 L 40 80 L 55 62 L 55 100 L 25 100 Z" />
                    </clipPath>
                    {/* 채워지는 영역 clipPath - 아래에서 위로 */}
                    <clipPath id={`female-fill-clip-${femalePercentage}`}>
                      <rect 
                        x="0" 
                        y={120 - (120 * (femalePercentage / 100))} 
                        width="80" 
                        height={120 * (femalePercentage / 100)} 
                      />
                    </clipPath>
                  </defs>
                  <g fill="#f43f5e" clipPath={`url(#female-full-clip-${femalePercentage})`}>
                    {/* 전체 아이콘 영역을 채우는 rect */}
                    <rect 
                      x="0" 
                      y={120 - (120 * (femalePercentage / 100))} 
                      width="80" 
                      height={120 * (femalePercentage / 100)} 
                      clipPath={`url(#female-fill-clip-${femalePercentage})`}
                      style={{ transition: 'all 0.5s ease' }}
                    />
                  </g>
                </>
              )}
            </svg>
          </div>
          <div className={`text-lg md:text-xl font-bold mb-1 ${femalePercentage > 0 ? 'text-[#f43f5e]' : 'text-gray-500'}`}>
            {femalePercentage.toFixed(0)}%
          </div>
          <div className="text-sm md:text-base text-gray-700 font-medium">여</div>
        </div>

        {/* 미정 아이콘 - 항상 표시 */}
        <div 
          className="flex flex-col items-center cursor-pointer transition-all duration-300 hover:scale-105 flex-1 min-w-0"
          style={{ maxWidth: '120px' }}
          onClick={() => handleClick(unknownData)}
        >
          <div className="relative mb-2">
            <svg width="80" height="120" viewBox="0 0 80 120" className="w-20 h-30 md:w-24 md:h-36">
              {/* 물음표 아이콘 전체 (회색) - 중앙 정렬 */}
              <g fill="#9ca3af">
                {/* 물음표 원형 배경 - 상단 중앙에 배치 */}
                <circle cx="40" cy="40" r="28" />
                {/* 물음표 모양 - "?" 글자 - 수직 중앙 정렬 */}
                <text 
                  x="40" 
                  y="40" 
                  fontSize="36" 
                  fontWeight="bold" 
                  fill="white" 
                  textAnchor="middle" 
                  dominantBaseline="central"
                  fontFamily="Arial, sans-serif"
                  alignmentBaseline="central"
                >
                  ?
                </text>
              </g>
            </svg>
          </div>
          <div className={`text-lg md:text-xl font-bold mb-1 ${unknownPercentage > 0 ? 'text-[#8b5cf6]' : 'text-gray-500'}`}>
            {unknownPercentage.toFixed(0)}%
          </div>
          <div className="text-sm md:text-base text-gray-700 font-medium">미정</div>
        </div>
      </div>
    </div>
  );
};

export default GenderChart;

