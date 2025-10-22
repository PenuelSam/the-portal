"use client";
import Lenis from "@studio-freight/lenis";
import { useEffect } from "react";

export function useLenis() {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true, // 👈 smooth for mobile
      lerp: 0.07,
        } as any);

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);
}