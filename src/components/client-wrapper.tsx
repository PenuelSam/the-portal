// components/ClientWrapper.tsx
'use client';

import { useLenis } from "@/lib/animations/lenis-setup";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useLenis();
  return <>{children}</>;
}