import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen">
      <div className="text-3xl font-bold">404 Not Found Page</div>
      <div className="text-xl font-bold text-gray-500">
        페이지를 찾을 수 없습니다.
      </div>
      <div className="mt-5">
        <Button text="메인화면으로 이동" onClick={() => navigate("/")} />
      </div>
    </div>
  );
};

export default NotFoundPage;
