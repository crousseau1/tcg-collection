import { PACK_SIZE, RARITY_ORDER } from "./rarity";
import type { GameCard, PackPull, Rarity } from "./types";

type Weight = { rarity: Rarity; weight: number };

const SLOTS: Weight[][] = [
  [
    { rarity: "commune", weight: 94 },
    { rarity: "rare", weight: 6 },
  ],
  [
    { rarity: "commune", weight: 90 },
    { rarity: "rare", weight: 10 },
  ],
  [
    { rarity: "commune", weight: 80 },
    { rarity: "rare", weight: 18 },
    { rarity: "epique", weight: 2 },
  ],
  [
    { rarity: "rare", weight: 72 },
    { rarity: "epique", weight: 24 },
    { rarity: "legendaire", weight: 4 },
  ],
  [
    { rarity: "rare", weight: 50 },
    { rarity: "epique", weight: 38 },
    { rarity: "legendaire", weight: 12 },
  ],
];

function roll(weights: Weight[]): Rarity {
  const total = weights.reduce((sum, item) => sum + item.weight, 0);
  let n = Math.random() * total;
  for (const item of weights) {
    n -= item.weight;
    if (n <= 0) return item.rarity;
  }
  return weights[weights.length - 1].rarity;
}

function pickCard(cards: GameCard[], rarity: Rarity) {
  const exact = cards.filter((card) => card.rarity === rarity);
  if (exact.length) return exact[Math.floor(Math.random() * exact.length)];

  const start = RARITY_ORDER.indexOf(rarity);
  for (let i = start - 1; i >= 0; i--) {
    const pool = cards.filter((card) => card.rarity === RARITY_ORDER[i]);
    if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  }
  for (let i = start + 1; i < RARITY_ORDER.length; i++) {
    const pool = cards.filter((card) => card.rarity === RARITY_ORDER[i]);
    if (pool.length) return pool[Math.floor(Math.random() * pool.length)];
  }
  return cards[Math.floor(Math.random() * cards.length)];
}

export function openPack(cards: GameCard[], owned: Record<string, number>): PackPull[] {
  if (!cards.length) return [];
  const pulls: PackPull[] = [];
  const nextOwned = { ...owned };
  for (let i = 0; i < PACK_SIZE; i++) {
    const rarity = roll(SLOTS[i] ?? SLOTS[SLOTS.length - 1]);
    const card = pickCard(cards, rarity);
    const wasOwned = (nextOwned[card.id] ?? 0) > 0;
    nextOwned[card.id] = (nextOwned[card.id] ?? 0) + 1;
    pulls.push({ cardId: card.id, new: !wasOwned });
  }
  return pulls;
}
