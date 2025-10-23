"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FormModal from "./form-modal";
import WelcomeModal from "./welcome-modal";

gsap.registerPlugin(SplitText, ScrollTrigger);

export const Manifesto = () => {
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
        <h1 className="text-[clamp(24px,6vw,64px)] font-HaasGrotDisp2 text-[var(--cherry)] mb-8 leading-[1.1]">
          /Manifesto
        </h1>

        <div className="fade-scroll flex flex-col gap-3 ">
          <p className=" text-[18px] text-[var(--charcoal)] font-HaasGrotDisp2  pr-5  leading-[1.2] ">We believe in living with <span className="text-[var(--cherry)]">feeling.</span> In making memories that last longer than the moment.</p> 
          <p className=" text-[18px] text-[var(--charcoal)] font-HaasGrotDisp2  pr-5  leading-[1.2] ">We believe in love that’s loud, in nights that don’t end, and in friends that turn into family.</p>
          <p className=" text-[18px] text-[var(--charcoal)] font-HaasGrotDisp2  pr-5  leading-[1.2] ">We believe <span className="text-[var(--cherry)]">emotion</span> is the new luxury. And freedom still looks best when it’s lived.</p>
          <p className=" text-[18px] text-[var(--charcoal)] font-HaasGrotDisp2  pr-5  leading-[1.2] ">This is <span className="text-[var(--cherry)]">Saint Moriartyy,</span> a world built by real people, for the ones who feel too much and keep going anyway.</p>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <button
            onClick={handleClick}
            className="relative px-4 py-3 rounded-full bg-[var(--cherry)] text-[var(--bone)] text-sm tracking-[0.05em] flex items-center justify-center overflow-hidden"
          >
            <div ref={textWrapperRef} className="flex items-center gap-3 transition-[gap] font-HaasGrotDisp">
              <span>Come</span>
              <div ref={lineRef} className="w-5 h-[1px] bg-[var(--bone)] "></div>
              <span>Closer</span>
            </div>
          </button>
        </div>
      </div>

      

      {/* Modals */}
      {showFormModal && (
        <FormModal
        title="Stay close."
        subtitle="The next story is already in motion."
        ctaText="Join the Movement"
          onClose={() => setShowFormModal(false)}
          onJoin={() => {
            setShowFormModal(false);
            setShowWelcomeModal(true);
          }}
        />
      )}

      {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} title="Welcome home." subtitle="You’re in." />}
    </section>
  );
};


