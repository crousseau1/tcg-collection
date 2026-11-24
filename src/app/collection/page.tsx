"use client";

import { CardFace } from "@/components/CardFace";
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
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => {
        setFamilies(data.families);
        setCards(data.cards);
        setCollection(data.collection);
      });
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
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl text-white">Collection</h1>
          <p className="text-sm opacity-70">
            {ownedCount}/{cards.length} cartes uniques ·{" "}
            {Object.values(collection.owned).reduce((a, b) => a + b, 0)} exemplaires
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            className="rounded bg-[#141a2e] p-2"
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value)}
          >
            <option value="all">Toutes les familles</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <select
            className="rounded bg-[#141a2e] p-2"
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as "all" | Rarity)}
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
              onlyOwned ? "bg-amber-300 text-black" : "border border-[#2a3354]"
            }`}
          >
            Possédées
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-3">
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
