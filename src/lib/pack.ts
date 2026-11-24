import { PACK_SIZE, RARITY_ORDER, sanitizeOdds } from "./rarity";
import type { GameCard, Odds, PackPull, Rarity } from "./types";

function roll(odds: Odds): Rarity {
  const clean = sanitizeOdds(odds);
  const total = RARITY_ORDER.reduce((sum, rarity) => sum + clean[rarity], 0);
  let n = Math.random() * total;
  for (const rarity of RARITY_ORDER) {
    n -= clean[rarity];
    if (n <= 0) return rarity;
  }
  return "commune";
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

export function openPack(cards: GameCard[], owned: Record<string, number>, odds: Odds): PackPull[] {
  if (!cards.length) return [];
  const pulls: PackPull[] = [];
  const nextOwned = { ...owned };
  for (let i = 0; i < PACK_SIZE; i++) {
    const rarity = roll(odds);
    const card = pickCard(cards, rarity);
    const wasOwned = (nextOwned[card.id] ?? 0) > 0;
    nextOwned[card.id] = (nextOwned[card.id] ?? 0) + 1;
    pulls.push({ cardId: card.id, new: !wasOwned });
  }
  return pulls;
}
