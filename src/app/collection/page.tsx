"use client";

import { CardFace } from "@/components/CardFace";
import { fetchCatalog } from "@/lib/api";
import { loadCollection } from "@/lib/player";
import { RARITY_ORDER, rarityLabel } from "@/lib/rarity";
import type { Collection, Family, GameCard, Rarity } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

export default function CollectionPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [collection, setCollection] = useState<Collection>({ owned: {}, lastPackAt: null });
  const [familyFilter, setFamilyFilter] = useState("all");
  const [rarityFilter, setRarityFilter] = useState<"all" | Rarity>("all");
  const [onlyOwned, setOnlyOwned] = useState(false);

  useEffect(() => {
    function refresh() {
      setCollection(loadCollection());
      fetchCatalog().then((data) => {
        setFamilies(data.families);
        setCards(data.cards);
      });
    }
    refresh();
    window.addEventListener("focus", refresh);
    const id = setInterval(() => setCollection(loadCollection()), 2000);
    return () => {
      window.removeEventListener("focus", refresh);
      clearInterval(id);
    };
  }, []);

  const familyById = useMemo(
    () => Object.fromEntries(families.map((f) => [f.id, f])),
    [families],
  );

  const visible = cards.filter((card) => {
    if (familyFilter !== "all" && card.familyId !== familyFilter) return false;
    if (rarityFilter !== "all" && card.rarity !== rarityFilter) return false;
    const count = collection.owned[card.id] ?? 0;
    if (onlyOwned && count === 0) return false;
    return true;
  });

  const ownedCount = cards.filter((card) => (collection.owned[card.id] ?? 0) > 0).length;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Album</p>
          <h1 className="display text-4xl text-white">Collection</h1>
          <p className="mt-1 text-sm text-stone-400">
            {ownedCount}/{cards.length} uniques ·{" "}
            {Object.values(collection.owned).reduce((a, b) => a + b, 0)} exemplaires
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={familyFilter} onChange={(e) => setFamilyFilter(e.target.value)} className="w-auto">
            <option value="all">Toutes les familles</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as "all" | Rarity)}
            className="w-auto"
          >
            <option value="all">Toutes les raretés</option>
            {RARITY_ORDER.map((r) => (
              <option key={r} value={r}>
                {rarityLabel[r]}
              </option>
            ))}
          </select>
          <button
            onClick={() => setOnlyOwned((v) => !v)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest ${
              onlyOwned ? "gold-btn" : "panel"
            }`}
          >
            Possédées
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        {visible.map((card) => {
          const count = collection.owned[card.id] ?? 0;
          return (
            <CardFace
              key={card.id}
              card={card}
              family={familyById[card.familyId]}
              owned={count}
              disabled={count === 0}
            />
          );
        })}
      </div>
    </section>
  );
}
