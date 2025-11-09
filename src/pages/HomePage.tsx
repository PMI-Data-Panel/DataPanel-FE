import LandingPage from "../components/HomePage/LandingPage";
import AboutSniffle from "../components/HomePage/AboutSniffle";
import Team from "../components/HomePage/Team";

const HomePage = () => {
  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hide bg-white">
      <LandingPage />

      <AboutSniffle />

      <Team />
    </div>
  );
};

export default HomePage;
