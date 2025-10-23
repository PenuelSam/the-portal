"use client";
import Lenis, { type LenisOptions } from "@studio-freight/lenis";
import { useEffect } from "react";

type ExtendedLenisOptions = LenisOptions & {
  smoothTouch?: boolean;
};

export function useLenis() {
    useEffect(() => {
    const options: ExtendedLenisOptions = {
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
       smoothTouch: true,
      lerp: 0.07,
        };

    const lenis = new Lenis(options);
    
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    
      return () => {
      lenis.destroy();
    };
  }, []);
}