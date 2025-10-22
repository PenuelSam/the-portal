"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

interface FormModalProps {
  onClose: () => void;
  onJoin: () => void;
}

export default function FormModal({ onClose, onJoin }: FormModalProps) {
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
      className="fixed inset-0 bg-white/50 flex items-center justify-center z-[100] p-4"
    >
      <div className="w-full h-[300px] max-w-md py-8 px-6 bg-[var(--bone)] rounded-md flex flex-col items-center justify-center gap-8 shadow">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--charcoal)] text-xl"
        >
          ✕
        </button>

        <h2 className="font-HaasGrotDisp2 text-[clamp(24px,6vw,48px)] text-[var(--cherry)] scale-y-[1.15] ">
          Stay Close.
        </h2>
        <p className="text-[clamp(14px,4vw,16px)] opacity-80 text-[var(--charcoal)]  font-HaasGrotDisp">
          Be the first to know when the next story drops.
        </p>

        <div className="relative w-full flex flex-col gap-5">
          <input
            type="text"
            placeholder="Email / Phone"
            className="w-full border-b border-[var(--cherry)] bg-transparent text-[var(--cherry)] p-2 text-[clamp(14px,4vw,16px)] font-HaasGrotDisp2 outline-none"
          />
          
        </div>
        <div className="w-full ">
            <button
            onClick={onJoin}
            className="border bg-[var(--cherry)]  w-full px-8 py-2 text-[var(--bone)] text-[clamp(14px,4vw,16px)] font-HaasGrotDisp2 hover:opacity-80 transition-opacity rounded-md"
          >
            Join Us
          </button>
          </div>
      </div>
    </div>
  );
}
