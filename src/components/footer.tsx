"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export const Footer = () => {

    useEffect(() => {
  const split = new SplitText('.split-lines', { type: 'lines' });
  gsap.from(split.lines, {
    scrollTrigger: {
      trigger: '.split-lines',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    yPercent: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.1,
  });
  return () => split.revert();
}, []);

  return (
    <section
   
     
      className="relative h-full w-full bg-[var(--cherry)] flex flex-col items-center px-6 py-25 overflow-hidden z-[10]"
    >

    <div
        className="hero-bg absolute inset-0 transition-colors duration-1000"
        style={{
          background:
            "linear-gradient(to bottom, rgba(40,0,0,0.95), rgba(85,15,15,0.9))",
        }}
      />
     
        <p className=" text-[18px] font-HaasGrotDisp2 text-[var(--bone)] absolute top-20 leading-[1.1]">
          Nothing real ever dies.
        </p>

<h1 className=" absolute bottom-5 font-HaasGrotDisp2 font-bold text-[50px] text-center w-full capitalize text-[var(--bone)] tracking-tighter leading-none scale-y-[1] inline-block z-[10]">
          Saint Moriartyy
        </h1>
      
      

      

  
    </section>
  );
};


