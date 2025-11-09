import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import { PawPrint } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-6 py-2.5 bg-black text-white">
      <strong className="cursor-pointer" onClick={() => navigate("/")}>
        <PawPrint size={24} />
      </strong>

      <div className="flex space-x-8 font-bold">
        <span>About</span>
        <span>Team</span>
        <span>Features</span>
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
