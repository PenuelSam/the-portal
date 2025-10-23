"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

interface WelcomeModalProps {
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function WelcomeModal({ onClose, title, subtitle }: WelcomeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 bg-[rgba(10,10,10,0.85)] flex items-center justify-center text-center text-[var(--bone)] z-[200] p-6"
    >
      <div className="w-full h-[300px] max-w-md py-8 px-6 bg-[var(--bone)] rounded-md flex flex-col items-center justify-center">
        <h2 className="font-HaasGrotDisp text-[clamp(18px,4vw,20px)] mb-4 text-[var(--cherry)]">
          { subtitle || "You’re in."}
        </h2>
        <p className=" text-[clamp(24px,6vw,48px)]  text-[var(--cherry)] font-HaasGrotDisp2  capitalize tracking-tighter leading-none transform scale-y-[1] inline-block">
          { title || "Welcome to Saint Moriartyy."}
        </p>

        <button
          onClick={onClose}
          className="mt-6 text-[var(--cherry)] border px-4 py-2 rounded-md text-sm font-HaasGrotDisp2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
