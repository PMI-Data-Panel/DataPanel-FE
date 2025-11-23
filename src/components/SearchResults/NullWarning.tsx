const NullWarning = () => {
  return (
    <>
      <div className="bg-[#e8f4fd] border border-[#b3d9f5] rounded-2xl p-5 flex items-start gap-4">
        <div className="shrink-0 w-6 h-6 rounded-full bg-[#3182f6] text-white flex items-center justify-center text-sm font-bold mt-0.5 shadow-sm">
          ⓘ
        </div>
        <p className="text-sm md:text-base text-[#1b64da] leading-relaxed">
          <span className="font-semibold">'알 수 없음'</span>은 해당 설문에 질문이 없었거나(null) 패널이 미기입한
          경우를 의미합니다.
        </p>
      </div>
    </>
  );
};

export default NullWarning;
