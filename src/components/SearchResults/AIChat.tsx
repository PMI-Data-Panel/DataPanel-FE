import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { postLLMRequery } from "../../apis/search";

interface AIChatProps {
  query: string;
  sessionId?: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIChat = ({ query, sessionId }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: `'${query}' 검색 결과에 대해 질문해주세요.`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!inputMessage.trim() || !sessionId) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // LLM 재질의 API 호출
      const response = await postLLMRequery({
        session_id: sessionId,
        query: currentInput,
        max_user_ids: 10,
        llm_instructions: "string",
      });

      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: response.llm_analysis.analysis,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error("LLM 재질의 API 호출 실패:", error);
      
      // 서버에서 반환한 에러 메시지 추출
      let errorContent = "죄송합니다. 질문에 대한 답변을 가져오는 중 오류가 발생했습니다.";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: { detail?: string; message?: string }; 
            status?: number 
          }; 
          message?: string 
        };
        
        // 서버에서 반환한 상세 에러 메시지가 있으면 사용
        if (axiosError.response?.data?.detail) {
          errorContent = axiosError.response.data.detail;
        } else if (axiosError.response?.data?.message) {
          errorContent = axiosError.response.data.message;
        } else if (axiosError.response?.status === 404) {
          errorContent = "검색 결과를 찾을 수 없습니다. 먼저 검색을 수행해 주세요.";
        }
      }
      
      const errorMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동 (채팅 영역 내부만)
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full max-h-full min-h-[400px] overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-200 shrink-0">
        <h3 className="text-sm md:text-base font-bold text-gray-800">
          검색된 패널 기반 재질의
        </h3>
      </div>

      {/* 메시지 영역 - 스크롤 가능 */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user"
                  ? "bg-[#3182f6] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-sm text-gray-500">LLM이 분석 중입니다...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="p-4 border-t border-gray-200 shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="질문을 입력하세요..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3182f6] text-sm"
          />
              <button
                onClick={handleSend}
                disabled={!inputMessage.trim() || !sessionId || isLoading}
                className="px-4 py-2 bg-[#3182f6] text-white rounded-lg hover:bg-[#1b64da] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <span className="text-sm">전송 중...</span>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
        </div>
      </div>
    </div>
  );
};

export default AIChat;

