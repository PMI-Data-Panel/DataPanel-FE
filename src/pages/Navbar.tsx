import { useNavigate } from "react-router-dom";
import { PawPrint, Search } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center px-4 md:px-8 py-2.5 text-white w-full max-w-full overflow-x-hidden bg-blue-700">
      {/* 로고 - 왼쪽 고정 */}
      <strong
        className="cursor-pointer flex-shrink-0 mr-3 md:mr-6 lg:mr-10"
        onClick={() => navigate("/")}
      >
        <PawPrint size={20} className="md:w-6 md:h-6" />
      </strong>

      {/* 메뉴 2개 */}
      <div className="flex flex-1 justify-center">
        <div className="max-w-screen ml-auto items-center font-bold text-sm md:text-base">
          <Search
            className="text-white cursor-pointer"
            onClick={() => navigate("/search")}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
