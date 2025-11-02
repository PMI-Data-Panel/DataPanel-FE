import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import InputForm from "../components/common/InputForm";

const LoginPage2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 로그인 시도
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 로딩 시뮬레이션

      // 임시 검증
      if (email === "admin@example.com" && password === "password") {
        localStorage.setItem("authToken", "dummy-token-123");
        localStorage.setItem("userEmail", email);

        navigate("/");
      } else {
        setError(
          "이메일 혹은 비밀번호가 올바르지 않습니다. 다시 확인해주세요."
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("로그인 중 오류가 발생하였습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-md animate-[fadeInUp_0.5s_ease-out]">
        <div className="text-center mb-8">
          <h1 className="text-[#333] text-3xl mb-2 font-semibold">
            관리자 로그인
          </h1>
          <p className="text-gray-600">DataPanel 관리 시스템에 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <InputForm type="email" setValue={setEmail} isLoading={isLoading} />
          <InputForm
            type="password"
            setValue={setPassword}
            isLoading={isLoading}
          />

          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-md border-l-4 border-red-700 text-sm animate-[shake_0.5s_ease-in-out]">
              {error}
            </div>
          )}

          <Button
            variant="primary"
            text="로그인"
            onClick={() => handleSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </form>

        {/* api 연결 후, 삭제 예정 */}
        <div className="text-sm italic text-gray-500 mt-6 text-center">
          <p>테스트 계정: admin@example.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage2;
