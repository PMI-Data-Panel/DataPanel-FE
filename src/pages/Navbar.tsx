import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
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
    <div className="flex justify-between items-center px-6 py-2.5 bg-black text-white">
      <strong className="cursor-pointer" onClick={() => navigate("/")}>
        <PawPrint size={24} />
      </strong>

      <div className="flex space-x-15 font-bold">
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

      <div>
        <Button
          variant="primary"
          text="로그인"
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

export default Navbar;
