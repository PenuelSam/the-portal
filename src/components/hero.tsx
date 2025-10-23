"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroIntroDirected() {
  const container = useRef<HTMLDivElement>(null);
  const starRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!container.current || !starRef.current || !canvasRef.current) return;

    document.body.style.overflow = "hidden";

    /** ✦ STAR DRAWING ANIMATION */
    const starPath = starRef.current.querySelector("path");
    if (starPath) {
      const length = starPath.getTotalLength();
      gsap.set(starPath, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.4,
      });
    }

    /** ✦ FLOATING STAR LOOP */
    const floatTl = gsap.timeline({ repeat: -1, yoyo: true, paused: true });
    floatTl.to(starRef.current, { y: "+=15", duration: 4, ease: "sine.inOut" });

    /** ✦ INTRO TIMELINE */
    const introTl = gsap.timeline();
    introTl
      .to(starPath, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "power2.inOut",
      })
      .to(
        starRef.current,
        { opacity: 0.2, duration: 1, ease: "power1.out" },
        "-=0.3"
      )
      .call(() => {floatTl.play()}, [], "-=0.2")
      .fromTo(
        ".starring",
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" },
        "-=0.1"
      )
      .to(".title-1", { opacity: 1, duration: 1.2, ease: "power2.out" }, "+=1");

    /** ✦ LOOPING TITLES */
    const titles = [".title-1", ".title-2", ".title-3", ".title-4"];
    const loopTl = gsap.timeline({ repeat: -1, paused: true });
    titles.forEach((cls) => {
      loopTl
        .to(cls, { opacity: 1, duration: 1.2, ease: "power2.out" })
        .to(cls, { opacity: 0, duration: 1.2, ease: "power2.in" }, "+=1");
    });
    introTl.call(() => {loopTl.play()});

    /** ✦ SCROLL PARALLAX EFFECTS */
    gsap.to(".text-block", {
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom center",
        scrub: 0.2,
      },
      y: -100,
      opacity: 0.4,
      ease: "power1.inOut",
    });

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
        gsap.set(starRef.current, { opacity: 0.5 });
      },
    });

    /** ✦ BACKGROUND COLOR TRANSITION */
    gsap.to(".hero-bg", {
      // backgroundColor: "var(--bone)",
      ease: "none",
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    /** ✦ FALLING STAR PARTICLES */
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    type Star = { x: number; y: number; size: number; speed: number; rotation: number; rotSpeed: number };
    let stars: Star[] = [];

    const createStars = () => {
      stars = [];
      for (let i = 0; i < 50; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2 + 1,
          speed: Math.random() * 1 + 0.3,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 0.4,
        });
      }
    };

    const drawStar = (x: number, y: number, r: number, rotation: number) => {
      const spikes = 5;
      const step = Math.PI / spikes;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation * (Math.PI / 180));
      ctx.beginPath();
      for (let i = 0; i < 2 * spikes; i++) {
        const rad = i % 2 === 0 ? r : r / 2;
        const angle = i * step;
        ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
      }
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.shadowBlur = 4;
      ctx.shadowColor = "white";
      ctx.fill();
      ctx.restore();
    };

    const animateStars = () => {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s) => {
        drawStar(s.x, s.y, s.size, s.rotation);
        s.y += s.speed;
        s.rotation += s.rotSpeed;
        if (s.y > h + 10) {
          s.y = -10;
          s.x = Math.random() * w;
        }
      });
      requestAnimationFrame(animateStars);
    };

    createStars();
    animateStars();

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      createStars();
    });

    setTimeout(() => (document.body.style.overflow = "auto"), 3000);

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
      className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden bg-[var(--cherry)] z-[10]"
    >
      {/* ✦ Dark Gradient Background with Cherry Tint */}
      <div
        className="hero-bg absolute inset-0 transition-colors duration-1000"
        style={{
          background:
            "linear-gradient(to bottom, rgba(40,0,0,0.95), rgba(85,15,15,0.9))",
        }}
      />

      {/* ✦ Falling Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[0] pointer-events-none"
      />

      {/* ✦ Floating Star SVG */}
      <svg
        ref={starRef}
        viewBox="0 0 200 200"
        className="absolute w-[60vw] max-w-[600px] h-auto z-[5]"
        fill="none"
        stroke="var(--bone)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0.4 }}
      >
        <path d="M100 10 L120 80 L190 80 L135 125 L155 190 L100 150 L45 190 L65 125 L10 80 L80 80 Z" />
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
        <h1 className="starring font-HaasGrotDisp2 font-bold  capitalize opacity-0 text-[var(--bone)] text-[clamp(18px,8vw,25px)] italic tracking-tighter leading-none scale-y-[1] inline-block mt-10">
         Starring You
        </h1>

        <h1 className="title-1 absolute left-1/2 -translate-x-1/2 text-[var(--bone)] font-HaasGrotDisp text-[clamp(45px,3vw,58px)] tracking-tighter opacity-0 lowercase w-full">
          The Midnight Club
        </h1>
        <h1 className="title-2 absolute left-1/2 -translate-x-1/2 text-[var(--bone)] font-HaasGrotDisp text-[clamp(45px,3vw,58px)] tracking-tighter opacity-0 lowercase w-full">
          Saint in Love
        </h1>
        <h1 className="title-3 absolute left-1/2 -translate-x-1/2 text-[var(--bone)] font-HaasGrotDisp text-[clamp(45px,3vw,58px)] tracking-tighter opacity-0 lowercase w-full">
          Forever Summer
        </h1>
        <h1 className="title-4 absolute left-1/2 -translate-x-1/2 text-[var(--bone)] font-HaasGrotDisp text-[clamp(45px,3vw,58px)] tracking-tighter opacity-0 lowercase w-full">
         The Dinner Club
        </h1>
        
      </div>
    </section>
  );
}
