import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    // 홈페이지로 이동
    if (window.location.pathname !== "/") {
      navigate("/");
      // 페이지 이동 후 스크롤
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // 이미 홈페이지에 있으면 바로 스크롤
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="flex items-center px-3 md:px-6 py-2.5 bg-black text-white w-full max-w-full overflow-x-hidden">
      {/* 로고 - 왼쪽 고정 */}
      <strong
        className="cursor-pointer flex-shrink-0 mr-3 md:mr-6 lg:mr-10"
        onClick={() => navigate("/")}
      >
        <PawPrint size={20} className="md:w-6 md:h-6" />
      </strong>

      {/* 메뉴 - 80% 가로폭에 균등 분배 */}
      <div className="flex flex-1 justify-center">
        <div className="flex w-[60%] lg:w-[40%] xl:w-[30%] max-w-3xl justify-between items-center font-bold text-sm md:text-base">
          <span
            className="cursor-pointer"
            onClick={() => scrollToSection("about")}
          >
            About
          </span>
          <span
            className="cursor-pointer"
            onClick={() => scrollToSection("team")}
          >
            Team
          </span>
          <span className="cursor-pointer" onClick={() => navigate("/data")}>
            Data
          </span>
          <span className="cursor-pointer" onClick={() => navigate("/search")}>
            Search
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
