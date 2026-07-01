import { AboutView } from "../views/about/about";
import { FeaturesView } from "../views/features/features";
import { HeroView } from "../views/hero/hero";

export const LandingPage = () => {
  return (
    <>
      <HeroView />
      <AboutView />
      <FeaturesView />
    </>
  );
};
