"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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

  /** ✦ Fade out and continue */
  const confirmChoice = useCallback(
    (enable: boolean) => {
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
    },
    [onContinue]
  );

  useEffect(() => {
    const knobElement = knobRef.current;
    if (!knobElement) return;

    const maxDrag = 100; // how far to drag right to trigger ON

    gsap.set(knobElement, { x: 0 });

    const [draggable] = Draggable.create(knobElement, {
      type: "x",
      bounds: { minX: 0, maxX: maxDrag },
      inertia: true,
      onDrag() {
        const progress = this.x / maxDrag;
        const active = progress > 0.5;
        setSoundEnabled(active);

        gsap.to(knobElement, {
          borderColor: active ? "var(--cherry)" : "var(--bone)",
          rotate: active ? 45 : 0,
          duration: 0.2,
        });
      },
      onRelease() {
        if (this.x > maxDrag / 2) {
          gsap.to(knobElement, {
            x: maxDrag,
            rotate: 45,
            duration: 0.3,
            ease: "power2.out",
          });
          confirmChoice(true);
        } else {
          gsap.to(knobElement, {
            x: 0,
            rotate: 0,
            duration: 0.3,
            ease: "power2.out",
          });
          confirmChoice(false);
        }
      },
    });

    return () => {
      draggable?.kill();
    };
  }, [confirmChoice]);

  // ✦ Optional animated glow (soft breathing effect)
  useEffect(() => {
    const glow = document.querySelector(".glow-circle");
    if (!glow) return;
    gsap.to(glow, {
      scale: 1.1,
      opacity: 0.35,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

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
          {/* Subtle Circular Glow */}
          {/* <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ zIndex: -1 }}
          >
            <div
              className="glow-circle"
              style={{
                width: "320px",
                height: "320px",
                background: "#F5F3EE",
                borderRadius: "50%",
                filter: "blur(120px)",
                opacity: 0.20,
              }}
            />
          </div> */}

         
          <h1 className="text-[var(--bone)] font-HaasGrotDisp2 italic text-[clamp(14px,5vw,16px)]  tracking-tight  ">
            A Digital Gateway into the Saint Moriartyy World
          </h1>

           <p className="text-[var(--bone)] font-HaasGrotDisp2 text-[clamp(14px,5vw,16px)] opacity-70 italic mb-8">
            Swipe the knob to enable sound
          </p>

          {/* ✦ Knob */}
          <div className="flex flex-col items-center gap-8">
            <div
              ref={knobRef}
              onClick={() => {
                setSoundEnabled(false);
                gsap.to(knobRef.current, {
                  x: 0,
                  rotate: 0,
                  duration: 0.4,
                  ease: "power2.inOut",
                });
              }}
              className="w-[60px] h-[60px] border-2 border-[var(--bone)] rounded-full cursor-pointer flex items-center justify-center text-[var(--bone)] text-2xl font-bold select-none shadow-lg"
            >
            <p className="w-5 h-5 bg-white rounded-full"></p> 
            </div>

            {/* Sound Status */}
            <p className="text-[var(--bone)] font-HaasGrotDisp2 text-sm uppercase opacity-80">
              Sound: {soundEnabled ? "ON" : "OFF"}
            </p>
          </div>
        </div>

        {/* <div className="absolute bottom-25 text-[16px] flex flex-col items-center text-[var(--bone)] opacity-50 font-HaasGrotDisp2">
          <p>Swipe arrow to enable sound</p> 
          <p>Tap to open without sound</p> 
        </div> */}
      </div>
    </>
  );
}
