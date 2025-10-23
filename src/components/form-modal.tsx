"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { gsap } from "gsap";

interface FormModalProps {
  onClose: () => void;
  onJoin: () => void;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export default function FormModal({ onClose, onJoin, title, subtitle, ctaText }: FormModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  if (!modalRef.current) return;

  // Set initial scale and opacity to 0 and animate to scale 1 and opacity 1
  gsap.fromTo(
    modalRef.current,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
  );
}, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (smsOptIn && !phoneNumber.trim()) {
      setError("Please add a phone number or uncheck SMS updates.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          phoneNumber: phoneNumber.trim() || undefined,
          smsOptIn,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to join the waitlist. Please try again.");
      }

      onJoin();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to join the waitlist. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
    >
      <div 
      ref={modalRef}
      className="relative w-full max-w-md py-8 px-6 bg-[var(--bone)] rounded-md flex flex-col gap-6 shadow">
        <button
          onClick={onClose}
           type="button"
          aria-label="Close"
          className="absolute top-4 right-4 text-[var(--charcoal)] text-xl"
        >
         <IoIosCloseCircleOutline fontSize={25}/>
        </button>

        <div className="flex flex-col items-center gap-2 text-center">
          <h2
            id="waitlist-title"
            className="font-HaasGrotDisp text-[clamp(24px,6vw,48px)] text-[var(--cherry)] scale-y-[1]"
          >
           { title || 'Stay Close.' }
          </h2>
          <p className="text-[clamp(14px,4vw,16px)] opacity-80 text-[var(--charcoal)] font-HaasGrotDisp2 tracking-tight">
            { subtitle || 'Be the first to know when the next story drops.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="waitlist-email"
              className="font-HaasGrotDisp2 text-[clamp(14px,4vw,16px)] text-[var(--charcoal)] uppercase"
            >
            
            <input
              id="waitlist-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Email Address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border-b border-[var(--cherry)] bg-transparent text-[var(--charcoal)] pt-2  text-[clamp(14px,4vw,16px)] font-HaasGrotDisp2 outline-none"
              required
            />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="waitlist-phone"
              className="font-HaasGrotDisp2 text-[clamp(14px,4vw,16px)] text-[var(--charcoal)] uppercase"
            >
              {/* Phone Number <span className="lowercase opacity-70">(optional)</span> */}
           
            <input
              id="waitlist-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="Phone Number (optional)"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              className="w-full border-b border-[var(--cherry)] bg-transparent text-[var(--charcoal)] pt-2  text-[clamp(14px,4vw,16px)] font-HaasGrotDisp2 outline-none"
            />
            </label>
          </div>

          <label className="flex items-center gap-2 text-[clamp(12px,3vw,14px)] text-[var(--charcoal)] font-HaasGrotDisp2">
            <input
            type="checkbox"
            checked={smsOptIn}
            onChange={(event) => setSmsOptIn(event.target.checked)}
            className="h-4 w-4 rounded border border-[var(--cherry)] appearance-none cursor-pointer 
             checked:bg-[var(--cherry)] checked:border-[var(--cherry)] 
             relative transition-colors duration-200"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='20 6 9 17 4 12'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "70% 70%",
              }}
            />
            I want text updates from Saint Moriartyy.
          </label>

          {error && (
            <p className="text-[var(--cherry)] text-[clamp(12px,3vw,14px)] font-HaasGrotDisp" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="border bg-[var(--cherry)] w-full px-8 py-2 text-[var(--bone)] text-[clamp(14px,4vw,16px)] font-HaasGrotDisp hover:opacity-80 transition-opacity rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >

            {isSubmitting ? "Joining..." : `${ctaText || "Join Us"}`}
          </button>
        </form>
        </div>
    </div>
  );
}
