import { useEffect, useState } from "react";

const Loading = () => {
  const messages = [
    "로딩중...",
    "조금만 기다려 주세요...",
    "데이터를 분석하고 있어요...",
  ];

  const [messageIndex, setMessageIndex] = useState(0);

  // 메시지 순환
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3500); // 3.5초마다 메시지 변경

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="flex-1 flex flex-col items-center mt-90">
      {/* 메시지 */}
      <div className="text-3xl font-semibold text-gray-700 flex items-center gap-2">
        <span>{messages[messageIndex].replace("...", "")}</span>
        {/* 물결 애니메이션 점 3개 */}
        <span className="flex gap-1">
          <span className="w-1.5 h-1.5 bg-gray-700 rounded-full animate-wave-dot1"></span>
          <span className="w-1.5 h-1.5 bg-gray-700 rounded-full animate-wave-dot2"></span>
          <span className="w-1.5 h-1.5 bg-gray-700 rounded-full animate-wave-dot3"></span>
        </span>
      </div>
    </div>
  );
};

export default Loading;
