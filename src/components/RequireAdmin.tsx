"use client";

import { useMode } from "@/components/ModeProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { mode, ready } = useMode();
  const router = useRouter();

  useEffect(() => {
    if (ready && mode !== "admin") router.replace("/packs");
  }, [mode, ready, router]);

  if (!ready || mode !== "admin") {
    return <p className="text-center text-stone-400">Passage en mode joueur…</p>;
  }
  return children;
}
