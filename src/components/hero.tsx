"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroIntroDirected() {
  const container = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!container.current || !starRef.current) return;

    document.body.style.overflow = "hidden";

    /** ✦ STAR SETUP — prepare stroke animation */
    const starPath = starRef.current.querySelector("path");
    if (starPath) {
      const length = starPath.getTotalLength();
      gsap.set(starPath, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });
    }

    /** ✦ FLOATING STAR LOOP — gentle motion */
    const floatTl: gsap.core.Timeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      paused: true,
    });

    floatTl.to(starRef.current, {
      y: "+=15",
      duration: 4,
      ease: "sine.inOut",
    });

    /** ✦ INTRO TIMELINE — draw star → fade → text */
    const introTl: gsap.core.Timeline = gsap.timeline();

    introTl
      // 1️⃣ Draw star
      .to(starPath, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
      })
      // 2️⃣ Fade to background opacity
      .to(
        starRef.current,
        { opacity: 0.2, duration: 1, ease: "power1.out" },
        "-=0.3"
      )
      // 3️⃣ Start floating
      .call(() => {
        floatTl.play();
      }, [], "-=0.2")
      // 4️⃣ Show main text
      .fromTo(
        ".starring",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.1"
      )
      // 5️⃣ Reveal first title
      .to(".title-1", { opacity: 1, duration: 1.2, ease: "power2.out" }, "+=1");

    /** ✦ LOOPING TITLES */
    const titles = [".title-1", ".title-2", ".title-3"];
    const loopTl: gsap.core.Timeline = gsap.timeline({
      repeat: -1,
      paused: true,
    });

    titles.forEach((cls) => {
      loopTl
        .to(cls, { opacity: 1, duration: 1.2, ease: "power2.out" })
        .to(cls, { opacity: 0, duration: 1.2, ease: "power2.in" }, "+=1");
    });

    introTl.call(() => {
      loopTl.play();
    });

    /** ✦ SCROLL PARALLAX EFFECTS */
    // Text moves upward
    gsap.to(".text-block", {
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom center",
        scrub: 0.2,
      },
      y: -100,
      opacity: 0.6,
      ease: "power1.inOut",
    });

    // Star moves down & scales down — opacity stays fixed
    gsap.to(starRef.current, {
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom center",
        scrub: 0.4,
      },
      y: 120,
      scale: 0.7,
      transformOrigin: "center center",
      ease: "power2.inOut",
      onUpdate: () => {
        gsap.set(starRef.current, { opacity: 0.5 }); // lock opacity
      },
    });

    /** ✦ BACKGROUND COLOR TRANSITION — Cherry → Bone */
    gsap.to(".hero-bg", {
      backgroundColor: "var(--bone)",
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    setTimeout(() => (document.body.style.overflow = "auto"), 3000);

    /** ✦ CLEANUP */
    return () => {
      ScrollTrigger.killAll();
      loopTl.kill();
      floatTl.kill();
      introTl.kill();
    };
  }, []);

  return (
    <section
      ref={container}
      className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden bg-[var(--bone)] z-[10]"
    >
      {/* ✦ Background Cherry Base */}
      <div className="hero-bg bg-[var(--cherry)] absolute inset-0 transition-colors duration-1000" />

      {/* ✦ Floating Star Behind Text */}
      <svg
        ref={starRef}
        viewBox="0 0 200 200"
        className="absolute w-[60vw] max-w-[600px] h-auto z-[5]"
        fill="none"
        stroke="var(--bone)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.2 }}
      >
        {/* Star shape */}
        <path d="M100 10 L120 80 L190 80 L135 125 L155 190 L100 150 L45 190 L65 125 L10 80 L80 80 Z" />

        {/* Slightly lowered “3” for perfect center */}
        <text
          x="100"
          y="135"
          textAnchor="middle"
          fontSize="60"
          fill="var(--bone)"
          fontFamily="Haas Grot Disp, sans-serif"
        >
          3
        </text>
      </svg>

      {/* ✦ Text Content */}
      <div className="w-full text-block relative z-10 text-center select-none text-[var(--charcoal)]">
        <h1 className="starring font-HaasGrotDisp2 font-bold text-[clamp(45px,3vw,48px)] capitalize opacity-0 text-[var(--bone)] tracking-tighter leading-none scale-y-[1] inline-block mt-10">
          Saint Moriartyy
        </h1>

        <h1 className="title-1 absolute left-1/2 -translate-x-1/2 text-[var(--bone)] font-HaasGrotDisp text-[clamp(16px,8vw,20px)] opacity-0 lowercase w-full">
          The Midnight Club
        </h1>
        <h1 className="title-2 absolute left-1/2 -translate-x-1/2 text-[var(--bone)] font-HaasGrotDisp text-[clamp(16px,8vw,20px)] opacity-0 lowercase w-full">
          Saint in Love
        </h1>
        <h1 className="title-3 absolute left-1/2 -translate-x-1/2 text-[var(--bone)] font-HaasGrotDisp text-[clamp(16px,8vw,20px)] opacity-0 lowercase w-full">
          Forever Summer
        </h1>
      </div>
    </section>
  );
}
