"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function Scene2Preview() {
  const container = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".scene2-text",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
      gsap.fromTo(
        ".scene2-glow",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 0.15,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",
          },
        }
      );
    }, container);
    return () => ctx.revert();
  }, []);

  const handleClick = () => {
    gsap.to(container.current, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => router.push("/starring-you"),
    });
  };

  return (
    <section
      ref={container}
      onClick={handleClick}
      className="relative h-[90vh] flex flex-col items-center justify-center bg-[var(--bone)] text-[var(--charcoal)] overflow-hidden cursor-pointer"
    >
      {/* Soft Cherry Glow */}
      <div className="scene2-glow absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,28,28,0.12)_0%,transparent_70%)] opacity-0 transition-all duration-700" />

      {/* Text */}
      <div className="scene2-text relative z-10 text-center px-6">
        <p className="text-sm uppercase tracking-[0.2em] mb-3 opacity-70">
          Scene 2
        </p>
        <h2 className="font-HaasGrotDisp2 text-[clamp(28px,8vw,64px)] text-[var(--cherry)] mb-4">
          Starring You
        </h2>
        <p className="max-w-sm mx-auto text-[clamp(14px,4vw,18px)] opacity-80 leading-relaxed">
          We don’t release clothes — we release stories. Tap to continue the journey.
        </p>
      </div>
    </section>
  );
}
