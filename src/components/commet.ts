// "use client";
// import { gsap, ScrollTrigger } from "@/lib/animations/gsap-setup";
// import { useEffect, useRef } from "react";

// gsap.registerPlugin(ScrollTrigger);

// export default function Scene3() {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const fixedLayerRef = useRef<HTMLDivElement>(null);
//   const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     if (!wrapperRef.current || !fixedLayerRef.current) return;

//     const ctx = gsap.context(() => {
//       // ✦ Reveal scene (Scene2 peeling away)
//       const revealTl = gsap.timeline({
//         scrollTrigger: {
//           trigger: wrapperRef.current,
//           start: "top bottom",
//           end: "bottom top",
//           scrub: 1.2,
//         },
//         defaults: { ease: "power2.out" },
//       });

//       revealTl
//         .fromTo(
//           fixedLayerRef.current,
//           { opacity: 0, y: 100 },
//           { opacity: 1, y: 0, duration: 1.2 }
//         )
//         .to(fixedLayerRef.current, { opacity: 1, y: 0, duration: 0.5 }); // stay visible

//       // ✦ Cards slide in horizontally as user scrolls
//       cardsRef.current.forEach((card, i) => {
//         gsap.fromTo(
//           card,
//           {
//             opacity: 0,
//             xPercent: i % 2 === 0 ? -80 : 80, // alternate directions
//           },
//           {
//             opacity: 1,
//             xPercent: 0,
//             ease: "power3.out",
//             duration: 1.2,
//             scrollTrigger: {
//               trigger: wrapperRef.current,
//               start: `${20 + i * 15}% center`, // stagger by scroll progress
//               end: `${30 + i * 15}% center`,
//               scrub: 1.2,
//             },
//           }
//         );
//       });

//       // ✦ Smoothly transition Scene3 from fixed → relative
//       ScrollTrigger.create({
//         trigger: wrapperRef.current,
//         start: "bottom bottom",
//         onEnter: () => {
//           fixedLayerRef.current!.style.position = "relative";
//         },
//         onLeaveBack: () => {
//           fixedLayerRef.current!.style.position = "fixed";
//         },
//       });
//     });

//     return () => ctx.revert();
//   }, []);

//   const cardContent = [
//     {
//       title: "The Midnight Club",
//       desc: "For the ones who don’t sleep — they dream louder.",
//     },
//     {
//       title: "Saint in Love",
//       desc: "For those who love fearlessly.",
//     },
//     {
//       title: "Forever Summer",
//       desc: "For the ones chasing warmth long after it’s gone.",
//     },
//     {
//       title: "The Dinner Club",
//       desc: "For the nights that turn strangers into family.",
//     },
//   ];

//   return (
//     <div ref={wrapperRef} className="relative w-full h-[250vh]">
//       {/* FIXED REVEAL LAYER */}
//       <section
//         ref={fixedLayerRef}
//         className="fixed top-0 left-0 w-full h-screen bg-[var(--washed-sand)] flex flex-col items-center justify-center overflow-hidden z-[1]"
//       >
//         {/* Ambient Glow */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,28,28,0.06)_0%,transparent_70%)] pointer-events-none" />

//         {/* Horizontal Card Stack */}
//         <div className="relative flex flex-col items-center justify-center gap-6 w-full px-4">
//           {cardContent.map((card, i) => (
//             <div
//               key={i}
//               ref={(el) => (cardsRef.current[i] = el)}
//               className="w-full max-w-[320px] sm:max-w-[380px] bg-[var(--bone)] rounded-2xl shadow-lg flex flex-col justify-center items-start text-left p-5 sm:p-6 opacity-0"
//               style={{
//                 transformOrigin: "center",
//                 boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
//               }}
//             >
//               <h3 className="font-HaasGrotDisp2 text-[var(--cherry)] text-[clamp(18px,5vw,22px)] leading-tight mb-1">
//                 {card.title}
//               </h3>
//               <p className="text-[var(--charcoal)] text-[clamp(14px,4vw,16px)] opacity-80 font-HaasGrotDisp leading-snug">
//                 {card.desc}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
