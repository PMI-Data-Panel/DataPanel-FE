import { Search } from "lucide-react";

type InputType = "email" | "password" | "search";

interface InputFormProps {
  type: InputType;
  setValue: (value: string) => void;
  labelOnOff?: boolean;
  isLoading?: boolean;
}

const InputForm = ({
  type,
  setValue,
  labelOnOff = true,
  isLoading,
}: InputFormProps) => {
  return (
    <div
      className={`flex flex-col gap-1.5 ${
        type === "search" ? "w-2/3 mx-auto" : "w-full"
      }`}
    >
      {labelOnOff && (
        <label className="font-medium text-[#333] text-sm">
          {type === "email"
            ? "이메일"
            : type === "password"
            ? "비밀번호"
            : "검색"}
        </label>
      )}
      {type === "email" || type === "password" ? (
        <input
          className="px-4 py-3 text-black border-2 border-gray-200 rounded-md text-base transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
          type={type}
          onChange={(e) => setValue(e.target.value)}
          required
          disabled={isLoading}
          placeholder={type === "email" ? "example@naver.com" : "password"}
        />
      ) : (
        <div className="relative w-full">
          <input
            className="w-full px-4 py-3 pr-16 text-black border-2 border-gray-200 rounded-2xl text-md transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
            type={type}
            onChange={(e) => setValue(e.target.value)}
            required
            disabled={isLoading}
            placeholder={"유성구에 사는 여성"}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 rounded-xl p-2 cursor-pointer hover:bg-blue-600 transition-colors">
            <Search className="text-white w-5 h-5" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InputForm;
