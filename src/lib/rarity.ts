import type { Rarity } from "./types";

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

export const PACK_COOLDOWN_MS = 60_000;
export const PACK_SIZE = 5;
