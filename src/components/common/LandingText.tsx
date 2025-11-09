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
  // 텍스트 크기 매핑
  const titleSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
  };

  const subSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const titleClass = `${titleSizeClasses[titleTextSize]} font-bold`;
  const subClass = `${subSizeClasses[subTextSize]} text-gray-500`;

  return (
    <div className="flex flex-col items-center justify-center">
      {titleText1 && <div className={titleClass}>{titleText1}</div>}
      {titleText2 && <div className={titleClass}>{titleText2}</div>}

      {/* titleTextFront + titleTextSpan + titleTextBack */}
      {titleTextFront && titleTextSpan && titleTextBack && (
        <div className={titleClass}>
          {titleTextFront}
          <span className="text-blue-600">{titleTextSpan}</span>
          {titleTextBack}
        </div>
      )}

      {/* titleTextFront + titleTextSpan (titleTextBack 없음) */}
      {titleTextFront && titleTextSpan && !titleTextBack && (
        <div className={titleClass}>
          {titleTextFront}
          <span className="text-blue-600">{titleTextSpan}</span>
        </div>
      )}

      {/* titleTextSpan + titleTextBack (titleTextFront 없음) */}
      {!titleTextFront && titleTextSpan && titleTextBack && (
        <div className={titleClass}>
          <span className="text-blue-600">{titleTextSpan}</span>
          {titleTextBack}
        </div>
      )}

      {subText1 && <p className={`${subClass} mt-4`}>{subText1}</p>}
      {subText2 && <p className={subClass}>{subText2}</p>}
    </div>
  );
};

export default LandingText;
