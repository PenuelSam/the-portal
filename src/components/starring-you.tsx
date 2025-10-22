"use client";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap-setup";
import { useEffect, useRef, useState } from "react";
import FormModal from "./form-modal";
import WelcomeModal from "./welcome-modal";

gsap.registerPlugin(ScrollTrigger);

export default function Scene3() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const fixedLayerRef = useRef<HTMLDivElement>(null);
  const scrollLayerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // CTA Refs
  const lineRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (!wrapperRef.current || !fixedLayerRef.current || !scrollLayerRef.current)
      return;

    /** ✦ FALLING STAR PARTICLES (Canvas Background) */
    const canvas = canvasRef.current!;
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

    /** ✦ SCENE ANIMATION */
    const ctxGsap = gsap.context(() => {
      // Reveal Scene
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top 70%",
          end: "bottom top",
          scrub: 1,
        },
        defaults: { ease: "power2.out" },
      });

      revealTl
        .fromTo(
          fixedLayerRef.current,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 1 }
        )
        .to(fixedLayerRef.current, { opacity: 0, y: -60, duration: 1 }, ">");

      // Looping fade for cards
      const loopTl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      cardsRef.current.forEach((card) => {
        loopTl
          .to(card, { opacity: 1, duration: 1.2, ease: "power2.out" })
          .to(card, { opacity: 0, duration: 1.2, ease: "power2.in" }, "+=1");
      });
      revealTl.call(() => {loopTl.play(0)});
    });

    return () => {
      ctxGsap.revert();
      ScrollTrigger.killAll();
    };
  }, []);

  /** ✦ CTA Animation Logic (same as Scene2) */
  const handleCTA = () => {
    if (showFormModal) return;
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 0.6 },
      onComplete: () => setShowFormModal(true),
    });
    tl.to(lineRef.current, { width: 0 }, 0);
    tl.to(textWrapperRef.current, { gap: "4px" }, 0);
  };

  /** ✦ CARD CONTENT */
  const cardContent = [
    { title: "The Midnight Club", desc: "For the ones who don’t sleep, they dream louder." },
    { title: "Saint in Love", desc: "For those who love fearlessly." },
    { title: "Forever Summer", desc: "For the ones chasing warmth long after it’s gone." },
    { title: "The Dinner Club", desc: "For the nights that turn strangers into family." },
  ];

  return (
    <div ref={wrapperRef} className="relative w-full h-[300vh] bg-[var(--cherry)]">
      {/* ✦ FIXED SCENE LAYER */}
      <section
        ref={fixedLayerRef}
        className="fixed bottom-0 left-0 w-full h-screen flex flex-col items-center justify-between z-[1]"
        style={{
          background: "linear-gradient(to bottom, rgba(40,0,0,0.95), rgba(85,15,15,0.9))",
        }}
      >
        {/* ✦ CANVAS (Falling Stars) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-[0] pointer-events-none"
        />

        {/* ✦ TITLE */}
        <div className="relative top-32 text-center flex flex-col gap-2 z-[2]">
          <h2 className="text-[clamp(24px,6vw,48px)] font-HaasGrotDisp text-[var(--bone)]">
            Coming Soon...
          </h2>
          <p className="text-[clamp(16px,6vw,18px)] w-[300px] leading-[1.2] font-HaasGrotDisp2 text-[var(--bone)]">
            We don’t release clothes, we release stories. Each drop is a new chapter in our world.
          </p>
        </div>

        {/* ✦ CARDS */}
        <div className="relative w-full flex items-center justify-center z-[2]">
          {cardContent.map((card, i) => (
            <div
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="absolute w-[85vw] sm:w-[320px] max-w-[400px] h-[400px] flex flex-col justify-center p-6 text-center opacity-0"
            >
              <h3 className="font-HaasGrotDisp2 text-[var(--bone)] text-[clamp(25px,6vw,40px)] mb-3 tracking-tighter leading-none">
                {card.title}
              </h3>
              <p className="text-[var(--bone)] text-[clamp(18px,4vw,20px)] font-HaasGrotDisp2 leading-snug lowercase">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ✦ CTA BUTTON (same animation as Scene2) */}
        <div className="relative bottom-32 z-[2]">
          <button
            onClick={handleCTA}
            className="relative px-4 py-3 rounded-full bg-[var(--bone)] text-[var(--cherry)] text-lg font-HaasGrotDisp2 border-2 border-[var(--bone)] hover:bg-transparent hover:text-[var(--bone)] transition-all duration-300 flex items-center justify-center "
          >
            <div ref={textWrapperRef} className="flex items-center gap-3 transition-[gap] font-HaasGrotDisp ">
              <span>Come</span>
              <div ref={lineRef} className="w-5 h-[1px] bg-[var(--cherry)]"></div>
              <span>Closer</span>
            </div>
          </button>
        </div>
      </section>

      {/* ✦ NEXT SECTION */}
      <section
        ref={scrollLayerRef}
        className="scene3-content relative -z-[0] h-screen bg-[var(--washed-sand)] items-center justify-center overflow-hidden hidden"
      >
        <p className="text-[var(--charcoal)] font-HaasGrotDisp2 opacity-60">
          Continue your journey ↓
        </p>
      </section>

      {/* ✦ MODALS */}
      {showFormModal && (
        <FormModal
          onClose={() => setShowFormModal(false)}
          onJoin={() => {
            setShowFormModal(false);
            setShowWelcomeModal(true);
          }}
        />
      )}

      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}
    </div>
  );
}
