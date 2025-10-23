"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function DesktopBetaNotice() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    /** ✦ FALLING STARS ANIMATION */
    const canvas = canvasRef.current;
    if (!canvas) return;
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

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom, rgba(40,0,0,0.95), rgba(85,15,15,0.9))",
      }}
    >
      {/* Falling Stars Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Center Card */}
      <div className="relative z-10 bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[rgba(255,255,255,0.1)] rounded-2xl p-10 text-center max-w-md mx-auto shadow-xl text-[var(--bone)] font-HaasGrotDisp2">
        <h1 className="text-2xl mb-4 font-semibold tracking-tight">
          Saint Moriartyy — Beta Mode
        </h1>
        <p className="opacity-80 leading-relaxed mb-6">
          The desktop version is still in progress.<br />
          For the best experience, please view this site on your mobile device.
        </p>
        <p className="opacity-50 text-sm italic">Stay tuned for the full release.</p>
      </div>
    </div>
  );
}
