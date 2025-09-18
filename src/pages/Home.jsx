import HeroSection from "../sections/homeSection/HeroSection";
import ExecutiveSummary from "../sections/homeSection/ExecutiveSummary";
import RoleDashboards from "../sections/homeSection/RoleDashboards";
import WorkFlowSection from "../sections/homeSection/WorkFlowSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <ExecutiveSummary />
      <RoleDashboards />
      <WorkFlowSection />
    </div>
  );
};

export default Home;
