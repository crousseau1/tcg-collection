import type { Odds, Rarity } from "./types";

export const RARITY_ORDER: Rarity[] = ["commune", "rare", "epique", "legendaire"];

export const rarityLabel: Record<Rarity, string> = {
  commune: "Commune",
  rare: "Rare",
  epique: "Épique",
  legendaire: "Légendaire",
};

export const rarityColor: Record<Rarity, string> = {
  commune: "#94a3b8",
  rare: "#38bdf8",
  epique: "#c084fc",
  legendaire: "#e8c36a",
};

export const defaultOdds: Odds = {
  commune: 70,
  rare: 20,
  epique: 8,
  legendaire: 2,
};

export const PACK_COOLDOWN_MS = 60_000;
export const PACK_SIZE = 5;

export function sanitizeOdds(value: Partial<Odds> | null | undefined): Odds {
  const next = { ...defaultOdds };
  for (const rarity of RARITY_ORDER) {
    const n = Number(value?.[rarity]);
    next[rarity] = Number.isFinite(n) && n >= 0 ? n : 0;
  }
  if (RARITY_ORDER.every((rarity) => next[rarity] === 0)) return { ...defaultOdds };
  return next;
}

export function oddsPercent(odds: Odds, rarity: Rarity) {
  const total = RARITY_ORDER.reduce((sum, key) => sum + Math.max(0, odds[key] ?? 0), 0);
  if (total <= 0) return 0;
  return (Math.max(0, odds[rarity] ?? 0) / total) * 100;
}
