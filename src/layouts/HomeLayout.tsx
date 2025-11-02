import { Outlet } from "react-router-dom";
import Navbar from "../pages/Navbar";

const HomeLayout = () => {
  return (
    <div className="h-dvh flex flex-col ">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      <footer></footer>
    </div>
  );
};

export default HomeLayout;
