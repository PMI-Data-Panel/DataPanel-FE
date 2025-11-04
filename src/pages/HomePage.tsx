import LandingPage from "../components/HomePage/LandingPage";
import AboutSniffle from "../components/HomePage/AboutSniffle";
import Team from "../components/HomePage/Team";

const HomePage = () => {
  return (
    <div className="h-full overflow-y-auto scrollbar-hide bg-white">
      <LandingPage />

      <AboutSniffle />

      <Team />

      {/* Footer */}
    </div>
  );
};

export default HomePage;
