"use client";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  soundEnabled: boolean;
};

const Header = ({ soundEnabled }: HeaderProps) => {
  const [isPlaying, setIsPlaying] = useState(soundEnabled);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      if (soundEnabled) {
        audioRef.current.play().catch(() => {
          console.log("Autoplay blocked until user interacts.");
        });
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-16 backdrop-blur-md font-HaasGrotDisp2 flex items-center justify-between px-6 z-50">
      {/* Left */}
      <div>
        <p className="text-[var(--bone)]">Menu</p>
      </div>

      {/* Center Logo */}
      <div>
        <p className="font-bold text-[#8a1c1c] capitalize text-[25px]">
          Saint <span className="text-[#8a1c1c]">Moriartyy</span>
        </p>
      </div>

      {/* Right - Sound Icon */}
      <div
        onClick={toggleSound}
        className="flex items-end gap-[3px] cursor-pointer group"
      >
        {[...Array(3)].map((_, i) => (
          <span
            key={i}
            className={`w-[3px] h-[10px] bg-[var(--bone)] rounded-sm transition-all ${
              isPlaying ? `animate-eq${i + 1}` : "opacity-60"
            }`}
          />
        ))}

        {/* Placeholder for now — just leave src blank or add your file later */}
        <audio ref={audioRef} src="" loop />
      </div>
    </nav>
  );
};

export default Header;
