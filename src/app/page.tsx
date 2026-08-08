import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { DemoSection } from "@/components/sections/DemoSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <FeaturesSection />
      <HowItWorks />
      <DemoSection />
      <CTASection />
    </>
  );
}
