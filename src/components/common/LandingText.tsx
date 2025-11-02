interface LandingTextProps {
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
}: LandingTextProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {titleText1 && <div className="text-2xl font-bold">{titleText1}</div>}
      {titleText2 && <div className="text-2xl font-bold">{titleText2}</div>}

      {/* titleTextFront + titleTextSpan + titleTextBack */}
      {titleTextFront && titleTextSpan && titleTextBack && (
        <div className="text-2xl font-bold">
          {titleTextFront}
          <span className="text-blue-600">{titleTextSpan}</span>
          {titleTextBack}
        </div>
      )}

      {/* titleTextFront + titleTextSpan (titleTextBack 없음) */}
      {titleTextFront && titleTextSpan && !titleTextBack && (
        <div className="text-2xl font-bold">
          {titleTextFront}
          <span className="text-blue-600">{titleTextSpan}</span>
        </div>
      )}

      {/* titleTextSpan + titleTextBack (titleTextFront 없음) */}
      {!titleTextFront && titleTextSpan && titleTextBack && (
        <div className="text-2xl font-bold">
          <span className="text-blue-600">{titleTextSpan}</span>
          {titleTextBack}
        </div>
      )}

      {subText1 && <p className="text-sm text-gray-400 mt-4">{subText1}</p>}
      {subText2 && <p className="text-sm text-gray-400">{subText2}</p>}
    </div>
  );
};

export default LandingText;
