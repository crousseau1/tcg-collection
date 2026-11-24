"use client";

import { CardFace } from "@/components/CardFace";
import { PACK_COOLDOWN_MS } from "@/lib/rarity";
import type { Collection, Family, GameCard, PackPull } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

function formatWait(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
}

export default function PacksPage() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [collection, setCollection] = useState<Collection>({ owned: {}, lastPackAt: null });
  const [pulls, setPulls] = useState<PackPull[]>([]);
  const [shown, setShown] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());

  async function load() {
    const res = await fetch("/api/catalog");
    const data = await res.json();
    setFamilies(data.families);
    setCards(data.cards);
    setCollection(data.collection);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!pulls.length || shown >= pulls.length) return;
    const id = setTimeout(() => setShown((n) => n + 1), 280);
    return () => clearTimeout(id);
  }, [pulls, shown]);

  const familyById = useMemo(
    () => Object.fromEntries(families.map((f) => [f.id, f])),
    [families],
  );
  const cardById = useMemo(() => Object.fromEntries(cards.map((c) => [c.id, c])), [cards]);

  const waitMs = collection.lastPackAt
    ? Math.max(0, PACK_COOLDOWN_MS - (now - collection.lastPackAt))
    : 0;
  const ready = waitMs <= 0 && !busy && cards.length > 0;

  async function open() {
    if (!ready) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/pack", { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Impossible d’ouvrir.");
      if (data.collection) setCollection(data.collection);
      setBusy(false);
      return;
    }
    setCollection(data.collection);
    setPulls(data.pulls);
    setShown(0);
    setBusy(false);
  }

  return (
    <section className="space-y-6">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-4xl text-white">Packs</h1>
        <p className="mt-2 text-slate-300">Un pack de 5 cartes, une fois par minute.</p>
        <button
          onClick={open}
          disabled={!ready}
          className="mt-5 rounded-full bg-amber-300 px-8 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black disabled:opacity-40"
        >
          {busy
            ? "Ouverture..."
            : !cards.length
              ? "Ajoute des cartes d’abord"
              : ready
                ? "Ouvrir un pack"
                : `Prochain pack ${formatWait(waitMs)}`}
        </button>
        {error && <p className="mt-3 text-rose-300">{error}</p>}
        {!cards.length && <p className="mt-3 text-amber-200">Ajoute des cartes dans l’atelier.</p>}
      </div>

      {pulls.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {pulls.slice(0, shown).map((pull, index) => {
            const card = cardById[pull.cardId];
            if (!card) return null;
            return (
              <div key={`${pull.cardId}-${index}`} className="animate-[pulse_0.4s_ease]">
                <CardFace
                  card={card}
                  family={familyById[card.familyId]}
                  fresh={pull.new}
                  owned={!pull.new ? (collection.owned[card.id] ?? 1) : undefined}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
