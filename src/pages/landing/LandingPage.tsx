import { useState } from 'react';
import { Navbar } from '../../components/landing/Navbar';
import { HeroSection } from '../../components/landing/HeroSection';
import { FeaturesBar } from '../../components/landing/FeaturesBar';
import { StepsSection } from '../../components/landing/StepsSection';
import { PlaygroundSection } from '../../components/landing/PlaygroundSection';
import { EditionsSection } from '../../components/landing/EditionsSection';
import { FooterCTA } from '../../components/landing/FooterCTA';

export default function LandingPage() {
  const [selectedEdition, setSelectedEdition] = useState<'gold' | 'silver'>('gold');

  return (
    <div className="min-h-screen bg-[#09090b] text-slate-300 relative selection:bg-[#ddb225] selection:text-black overflow-x-hidden">
      {/* Luces sutiles de fondo */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(221,178,37,0.05),transparent_55%)]" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.03),transparent_45%)]" />

      <Navbar edition={selectedEdition} />

      <main>
        <HeroSection edition={selectedEdition} onEditionChange={setSelectedEdition} />
        <FeaturesBar />
        <StepsSection />
        <PlaygroundSection />
        <EditionsSection />
        <FooterCTA />
      </main>
    </div>
  );
}