"use client";
import { useEffect, useState } from "react";
import Hero from "@/components/hero";
import { Scene2 } from "@/components/welcome";
import Scene3 from "@/components/starring-you";
import SoundGate from "@/components/sound-gate";
import Header from "@/components/header";
import { Manifesto } from "@/components/manifesto";
import { Footer } from "@/components/footer";
import DesktopBetaNotice from "@/components/desktop-beta-notice";

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState<boolean | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //  No SoundGate or site content for desktop
  if (isDesktop) {
    return <DesktopBetaNotice />;
  }

  //  Mobile experience starts with SoundGate
  if (soundEnabled === null) {
    return <SoundGate onContinue={setSoundEnabled} />;
  }

  //  Mobile full site
  return (
    <div className="relative">
      <Header soundEnabled={soundEnabled} />
      <Hero />
      <Scene2 />
      <Scene3 />
      <Manifesto />
      <Footer />
    </div>
  );
}
