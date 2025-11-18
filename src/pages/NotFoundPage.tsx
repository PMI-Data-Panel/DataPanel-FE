import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
    // 페이지 이동 후 최상단으로 스크롤
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4 justify-center items-center h-screen w-full max-w-full overflow-hidden px-4">
      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-center">
        404 Not Found Page
      </div>
      <div className="text-base md:text-xl font-bold text-gray-500 text-center px-2">
        페이지를 찾을 수 없습니다.
      </div>
      <div className="mt-3 md:mt-5">
        <Button text="메인화면으로 이동" onClick={handleGoHome} />
      </div>
    </div>
  );
};

export default NotFoundPage;
