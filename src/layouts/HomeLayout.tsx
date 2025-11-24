import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../pages/Navbar";
import Footer from "../pages/Footer";

const HomeLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen  flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {isHomePage && <Footer />}
    </div>
  );
};

export default HomeLayout;
