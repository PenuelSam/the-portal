"use client";
import { useState } from "react";
import Hero from "@/components/hero";
import { Scene2 } from "@/components/welcome";
import Scene3 from "@/components/starring-you";
import SoundGate from "@/components/sound-gate";
import Header from "@/components/header";

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState<boolean | null>(null);

  if (soundEnabled === null) {
    return <SoundGate onContinue={setSoundEnabled} />;
  }

  return (
    <div className="relative">
      {/* Pass soundEnabled to Header */}
      <Header soundEnabled={soundEnabled} />

      {/* Your site */}
      <Hero />
      <Scene2 />
      <Scene3 />

      <section className="h-screen bg-[var(--bone)] flex items-center justify-center text-[var(--charcoal)] font-HaasGrotDisp2">
        <p>Next Chapter — Coming Soon</p>
      </section>
    </div>
  );
}
