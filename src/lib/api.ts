import cardsFallback from "../../data/cards.json";
import familiesFallback from "../../data/families.json";
import oddsFallback from "../../data/odds.json";
import { sanitizeOdds } from "./rarity";
import type { Family, GameCard, Odds } from "./types";

const staticCatalog = () => ({
  families: familiesFallback as Family[],
  cards: cardsFallback as GameCard[],
  odds: sanitizeOdds(oddsFallback as Odds),
  collection: { owned: {}, lastPackAt: null },
});

export async function fetchCatalog() {
  if (process.env.NEXT_PUBLIC_STATIC === "1") return staticCatalog();
  try {
    const res = await fetch("/api/catalog", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.cards)) return data;
    }
  } catch {
    // Hébergement statique : on lit le set bundlé.
  }
  return staticCatalog();
}

export function patchCatalog(body: unknown) {
  return fetch("/api/catalog", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  }).then((r) => r.json());
}
