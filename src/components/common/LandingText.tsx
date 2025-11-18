interface LandingTextProps {
  titleTextSize?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  subTextSize?: "xs" | "sm" | "md" | "lg";
  titleText1?: string;
  titleText2?: string;
  subText1?: string;
  subText2?: string;
  titleTextFront?: string;
  titleTextSpan?: string;
  titleTextBack?: string;
}

const LandingText = ({
  titleText1,
  titleText2,
  subText1,
  subText2,
  titleTextFront,
  titleTextSpan,
  titleTextBack,
  titleTextSize = "2xl",
  subTextSize = "sm",
}: LandingTextProps) => {
  // 반응형 텍스트 크기 매핑 적용
  const titleSizeClasses = {
    sm: "text-xs md:text-sm", // 모바일
    md: "text-sm md:text-base", // 태블릿
    lg: "text-base md:text-lg", // 데탑
    xl: "text-lg md:text-xl",
    "2xl": "text-xl md:text-2xl lg:text-3xl",
    "3xl": "text-2xl md:text-3xl lg:text-4xl",
    "4xl": "text-3xl md:text-4xl lg:text-5xl",
  };

  const subSizeClasses = {
    xs: "text-xs md:text-xs",
    sm: "text-xs md:text-sm",
    md: "text-sm md:text-base",
    lg: "text-base md:text-lg",
  };

  const titleClass = `${titleSizeClasses[titleTextSize]} font-bold`;
  const subClass = `${subSizeClasses[subTextSize]} text-gray-500`;

  return (
    <div className="flex flex-col items-center justify-center px-4 text-center">
      {titleText1 && (
        <div className={`${titleClass} leading-tight`}>{titleText1}</div>
      )}
      {titleText2 && (
        <div className={`${titleClass} leading-tight`}>{titleText2}</div>
      )}

      {/* titleTextFront + titleTextSpan + titleTextBack */}
      {titleTextFront && titleTextSpan && titleTextBack && (
        <div className={`${titleClass} leading-tight`}>
          {titleTextFront}
          <span className="text-blue-600">{titleTextSpan}</span>
          {titleTextBack}
        </div>
      )}

      {/* titleTextFront + titleTextSpan (titleTextBack 없음) */}
      {titleTextFront && titleTextSpan && !titleTextBack && (
        <div className={`${titleClass} leading-tight`}>
          {titleTextFront}
          <span className="text-blue-600">{titleTextSpan}</span>
        </div>
      )}

      {/* titleTextSpan + titleTextBack (titleTextFront 없음) */}
      {!titleTextFront && titleTextSpan && titleTextBack && (
        <div className={`${titleClass} leading-tight`}>
          <span className="text-blue-600">{titleTextSpan}</span>
          {titleTextBack}
        </div>
      )}

      {subText1 && (
        <p className={`${subClass} mt-2 md:mt-4 max-w-2xl`}>{subText1}</p>
      )}
      {subText2 && <p className={`${subClass} max-w-2xl`}>{subText2}</p>}
    </div>
  );
};

export default LandingText;
