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
        className="cursor-pointer flex-shrink-0 mr-3 md:mr-0"
        onClick={() => navigate("/")}
      >
        <PawPrint size={20} className="md:w-6 md:h-6" />
      </strong>

      {/* 메뉴 - 모바일에서 균등 분배, 데스크탑에서 오른쪽 정렬 */}
      <div className="flex flex-1 justify-around md:justify-end md:space-x-8 lg:space-x-15 font-bold text-sm md:text-base">
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
  );
};

export default Navbar;
