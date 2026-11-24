"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type AppMode = "player" | "admin";

const ModeContext = createContext<{
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  ready: boolean;
}>({
  mode: "player",
  setMode: () => undefined,
  ready: false,
});

const KEY = "vault-mode";

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("player");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(KEY);
    if (saved === "admin" || saved === "player") setModeState(saved);
    setReady(true);
  }, []);

  function setMode(next: AppMode) {
    setModeState(next);
    window.localStorage.setItem(KEY, next);
  }

  return <ModeContext.Provider value={{ mode, setMode, ready }}>{children}</ModeContext.Provider>;
}

export function useMode() {
  return useContext(ModeContext);
}
