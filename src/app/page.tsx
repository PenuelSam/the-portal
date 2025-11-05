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
import FormModal from "@/components/form-modal";

export default function Home() {
  const [soundEnabled, setSoundEnabled] = useState<boolean | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  /** 🖥 Detect Device Type */
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /** 🪄 Start modal timer ONLY after user passes SoundGate */
  useEffect(() => {
    if (soundEnabled) {
      const timer = setTimeout(() => {
        if (!modalDismissed) {
          setShowEntryModal(true);
        }
      }, 3000); // 
      return () => clearTimeout(timer);
    }
  }, [soundEnabled, modalDismissed]);

  /**  Disable background scroll when modal is open */
  useEffect(() => {
    if (showEntryModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showEntryModal]);

  /** 📨 Handlers */
  const handleJoin = () => {
    setModalDismissed(true);
    setShowEntryModal(false);
  };

  const handleClose = () => {
    setModalDismissed(true);
    setShowEntryModal(false);
  };

  /** 🧠 Render Logic */
  if (isDesktop) return <DesktopBetaNotice />;
  if (soundEnabled === null) return <SoundGate onContinue={setSoundEnabled} />;

  /** 📱 Mobile Experience */
  return (
    <div className="relative">
      <Header soundEnabled={soundEnabled} />
      <Hero />
      <Scene2 />
      <Scene3 />
      {/* <Manifesto /> */}
      <Footer />

      {/* ✦ Entry Waitlist Modal */}
      {showEntryModal && (
        <div className="animate-fadeIn">
          <FormModal
            onClose={handleClose}
            onJoin={handleJoin}
            title="Join the Waitlist"
            subtitle="Be part of the story before it begins."
            ctaText="Join Now"
          />
        </div>
      )}
    </div>
  );
}
