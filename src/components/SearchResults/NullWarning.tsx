const NullWarning = () => {
  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold mt-0.5">
          ⓘ
        </div>
        <p className="text-sm text-blue-800">
          '모름'은 해당 설문에 질문이 없었거나(null) 패널이 미기입한 경우를
          의미합니다.
        </p>
      </div>
    </>
  );
};

export default NullWarning;
