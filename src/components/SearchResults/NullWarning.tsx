const NullWarning = () => {
  return (
    <>
      <div className="bg-[#e8f4fd] border border-[#b3d9f5] rounded-lg p-3 md:p-4 flex items-start gap-3">
        <div className="shrink-0 w-5 h-5 rounded-full bg-[#3182f6] text-white flex items-center justify-center text-xs font-bold mt-0.5 shadow-sm">
          ⓘ
        </div>
        <p className="text-xs md:text-sm text-[#1b64da] leading-relaxed">
          <span className="font-semibold">'알 수 없음'</span>은 해당 설문에 질문이 없었거나(null) 패널이 미기입한
          경우를 의미합니다.
        </p>
      </div>
    </>
  );
};

export default NullWarning;
