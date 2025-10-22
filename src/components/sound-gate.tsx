"use client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import Draggable from "gsap/Draggable";
import NoiseOverlay from "./noise";

gsap.registerPlugin(Draggable);

export default function SoundGate({
  onContinue,
}: {
  onContinue: (soundEnabled: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGSVGElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if (!knobRef.current) return;

    const maxDrag = 100; // how far to drag right to trigger ON
    const knob = knobRef.current;

    // Reset to center
    gsap.set(knob, { x: 0 });

    Draggable.create(knob, {
      type: "x",
      bounds: { minX: 0, maxX: maxDrag },
      inertia: true,
      onDrag() {
        const progress = this.x / maxDrag;
        const active = progress > 0.5;
        setSoundEnabled(active);

        gsap.to(knob, {
          borderColor: active ? "var(--cherry)" : "var(--bone)",
          rotate: active ? 45 : 0,
          duration: 0.2,
        });
      },
      onRelease() {
        if (this.x > maxDrag / 2) {
          // Swiped right → Enable sound
          gsap.to(knob, {
            x: maxDrag,
            rotate: 45,
            duration: 0.3,
            ease: "power2.out",
          });
          confirmChoice(true);
        } else {
          // Snap back → Disable sound
          gsap.to(knob, {
            x: 0,
            rotate: 0,
            duration: 0.3,
            ease: "power2.out",
          });
          confirmChoice(false);
        }
      },
    });
  }, []);

  /** ✦ Fade out and continue */
  const confirmChoice = (enable: boolean) => {
    setSoundEnabled(enable);
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setIsOpen(false);
        onContinue(enable);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <NoiseOverlay />
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-[rgba(10,0,0,0.96)] z-[9999] flex items-center justify-center overflow-hidden"
      >
        {/* ✦ Huge Star Background */}
        <svg
          ref={starRef}
          viewBox="0 0 200 200"
          className="absolute w-[270vw] md:w-[150vw] max-w-[2000px] h-auto opacity-[0.12]"
          fill="none"
          stroke="var(--bone)"
          strokeWidth="0.5"
        >
          <path d="M100 10 L120 80 L190 80 L135 125 L155 190 L100 150 L45 190 L65 125 L10 80 L80 80 Z" />
        </svg>

        {/* ✦ Center Content */}
        <div className="relative z-[10] flex flex-col items-center justify-center text-center px-6 mt-10">
          <p className="text-[var(--bone)] font-HaasGrotDisp2 text-[clamp(14px,5vw,16px)] opacity-70 italic">
            Starring You
          </p>
          <h1 className="text-[var(--bone)] font-HaasGrotDisp2 text-[clamp(18px,5vw,22px)] mb-8 tracking-tight">
            A Digital Gateway into the Saint Moriartyy World
          </h1>

          {/* ✦ Knob Only */}
          <div className="flex flex-col items-center gap-8">
            <div
              ref={knobRef}
              onClick={() => {
                // Tap = OFF
                setSoundEnabled(false);
                gsap.to(knobRef.current, {
                  x: 0,
                  rotate: 0,
                  duration: 0.4,
                  ease: "power2.inOut",
                });
              }}
              className="w-[60px] h-[60px] border-2 border-[var(--bone)] rounded-full 
              cursor-pointer flex items-center justify-center 
              text-[var(--bone)] text-2xl font-bold select-none shadow-lg"
            >
              →
            </div>

            {/* Sound Status */}
            <p className="text-[var(--bone)] font-HaasGrotDisp2 text-sm uppercase opacity-80">
              Sound: {soundEnabled ? "ON" : "OFF"}
            </p>
          </div>
        </div>

        <div className="absolute bottom-25 text-[16px] text-[var(--bone)] opacity-50 font-HaasGrotDisp2"> Tap/Drag to choose your vibe </div>
      </div>
    </>
  );
}
