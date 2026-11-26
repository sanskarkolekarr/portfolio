import { HeroSection } from "@/components/HeroSection";
import { BusinessSection } from "@/components/BusinessSection";
import { BeyondSection } from "@/components/BeyondSection";

export default function Home() {
  return (
    <main className="editorial-grain relative min-h-screen bg-obsidian text-cream">
      <HeroSection />
      <BusinessSection />
      <BeyondSection />
    </main>
  );
}
