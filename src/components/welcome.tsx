"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FormModal from "./form-modal";
import WelcomeModal from "./welcome-modal";

gsap.registerPlugin(SplitText, ScrollTrigger);

export const Scene2 = () => {
  const container = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
     if (!container) return;
    const ctx = gsap.context(() => {
      const el = container.current;
      if (!el) return;
      const fadeScroll = el.querySelector(".fade-scroll");
      if (!fadeScroll) return;
      const split = new SplitText(fadeScroll, { type: "words" });

      gsap.fromTo(
        split.words,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: fadeScroll,
            start: "top 90%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    }, container);

    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    if (showFormModal) return;
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 0.6 },
      onComplete: () => setShowFormModal(true),
    });
    tl.to(lineRef.current, { width: 0 }, 0);
    tl.to(textWrapperRef.current, { gap: "4px" }, 0);
  };

  return (
    <section
      ref={container}
     
      className="relative h-full w-full bg-[var(--bone)] flex flex-col  px-6 py-10 overflow-hidden z-[10]"
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(138,28,28,0.04)_0%,transparent_70%)] pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-[720px] text-left z-10">
        {/* <h1 className="text-[clamp(24px,6vw,64px)] font-HaasGrotDisp2 text-[var(--cherry)] mb-8 leading-[1.1]">
          /Intro
        </h1> */}

        <p className="fade-scroll text-[clamp(25px,6vw,56px)] font-HaasGrotDisp text-[#333333e8] tracking-[-0.02em] leading-[1.1] ">
          We believe in living with <span className="text-[var(--cherry)]">feeling.</span> In making memories that last longer than the moment.
        </p>

        <div className="border w-full border-[var(--cherry)] my-8 opacity-[0.2]" />

        <div className="flex flex-col gap-2">
          <p className="text-[16px] text-[var(--charcoal)] font-HaasGrotDisp leading-[1.2] opacity-50 max-w-[640px] tracking-wide">
            We make clothing and stories for the dreamers, the lovers, and the ones who never fit neatly into boxes.
            For people who feel deeply, live loudly, and move through life like art.
          </p>

          <p className="text-[16px] text-[var(--charcoal)] font-HaasGrotDisp leading-[1.2] opacity-50 max-w-[640px] tracking-wide">
            Every piece we create is a small reminder: freedom still looks best when it’s lived.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <button
            onClick={handleClick}
            className="relative px-4 py-3 rounded-md bg-[var(--cherry)] text-[var(--bone)] text-sm tracking-[0.05em] flex items-center justify-center overflow-hidden "
          >
            <div ref={textWrapperRef} className="flex items-center gap-3 transition-[gap] font-HaasGrotDisp">
              <span>Join our community</span>
            </div>
          </button>
        </div>
      </div>

      

      {/* Modals */}
      {showFormModal && (
        <FormModal
          onClose={() => setShowFormModal(false)}
          onJoin={() => {
            setShowFormModal(false);
            setShowWelcomeModal(true);
          }}
        />
      )}

      {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} />}
    </section>
  );
};


