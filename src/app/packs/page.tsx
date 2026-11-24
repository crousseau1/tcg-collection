"use client";

import { CardFace } from "@/components/CardFace";
import { useMode } from "@/components/ModeProvider";
import { fetchCatalog } from "@/lib/api";
import { openPack } from "@/lib/pack";
import { loadCollection, saveCollection } from "@/lib/player";
import { PACK_COOLDOWN_MS, RARITY_ORDER, defaultOdds, oddsPercent, rarityColor, rarityLabel } from "@/lib/rarity";
import type { Collection, Family, GameCard, Odds, PackPull } from "@/lib/types";
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
  const [odds, setOdds] = useState<Odds>(defaultOdds);
  const [pulls, setPulls] = useState<PackPull[]>([]);
  const [shown, setShown] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now());
  const { mode } = useMode();

  useEffect(() => {
    setCollection(loadCollection());
    function load() {
      fetchCatalog().then((data) => {
        setFamilies(data.families);
        setCards(data.cards);
        setOdds(data.odds);
      });
    }
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!pulls.length || shown >= pulls.length) return;
    const id = setTimeout(() => setShown((n) => n + 1), 220);
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
    try {
      const data = await fetchCatalog();
      const current = loadCollection();
      const nextPulls = openPack(data.cards, current.owned, data.odds);
      if (!nextPulls.length) {
        setError("Le set est vide.");
        setBusy(false);
        return;
      }
      const owned = { ...current.owned };
      for (const pull of nextPulls) {
        owned[pull.cardId] = (owned[pull.cardId] ?? 0) + 1;
      }
      const next = { owned, lastPackAt: Date.now() };
      saveCollection(next);
      setCollection(next);
      setPulls(nextPulls);
      setShown(0);
    } catch {
      setError("Impossible d’ouvrir.");
    }
    setBusy(false);
  }

  return (
    <section className="space-y-8">
      <div className="panel mx-auto max-w-xl rounded-[2rem] px-8 py-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--gold)]">Sceau</p>
        <h1 className="display mt-2 text-5xl text-white">Packs</h1>
        <p className="mt-3 text-stone-400">Cinq cartes. Une fois par minute. Ton album reste sur cet appareil.</p>
        {mode === "admin" && (
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-[11px] uppercase tracking-widest">
            {RARITY_ORDER.map((rarity) => (
              <span key={rarity} className="rounded-full px-3 py-1" style={{ color: rarityColor[rarity], border: `1px solid ${rarityColor[rarity]}55` }}>
                {rarityLabel[rarity]} {oddsPercent(odds, rarity).toFixed(0)}%
              </span>
            ))}
          </div>
        )}
        <button onClick={open} disabled={!ready} className="gold-btn mt-7 px-10 py-4 text-sm">
          {busy
            ? "Bris du sceau…"
            : !cards.length
              ? "Le set est vide"
              : ready
                ? "Ouvrir un pack"
                : `Prochain pack ${formatWait(waitMs)}`}
        </button>
        {error && <p className="mt-3 text-rose-300">{error}</p>}
      </div>

      {pulls.length > 0 && (
        <div className="flex flex-wrap justify-center gap-5">
          {pulls.slice(0, shown).map((pull, index) => {
            const card = cardById[pull.cardId];
            if (!card) return null;
            return (
              <div key={`${pull.cardId}-${index}`} className="reveal" style={{ animationDelay: `${index * 40}ms` }}>
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
