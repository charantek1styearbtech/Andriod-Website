import Nav from "@/components/Nav";
import ScrollRefresh from "@/components/ScrollRefresh";
import SmoothScroll from "@/components/SmoothScroll";
import DeviceStage from "@/components/stage/DeviceStage";
import DevExperience from "@/components/sections/DevExperience";
import BugBounty from "@/components/sections/BugBounty";
import Compatibility from "@/components/sections/Compatibility";
import Setup from "@/components/sections/Setup";
import Tools from "@/components/sections/Tools";
import OpenSource from "@/components/sections/OpenSource";
import Final from "@/components/sections/Final";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <SmoothScroll>
      <ScrollRefresh />
      <Nav />
      <main>
        {/* Persistent stage: hero + 8 phases, camera driven by scroll */}
        <DeviceStage />

        {/* Content that scrolls over the (now hidden) fixed stage */}
        <div className="relative z-10 bg-void">
          <DevExperience />
          <BugBounty />
          <Compatibility />
          <Setup />
          <Tools />
          <OpenSource />
          <Final />
          <Footer />
        </div>
      </main>
    </SmoothScroll>
  );
}
