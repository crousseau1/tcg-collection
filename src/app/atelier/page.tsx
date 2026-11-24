"use client";

import { CardFace } from "@/components/CardFace";
import { fetchCatalog, patchCatalog } from "@/lib/api";
import { RARITY_ORDER, defaultOdds, oddsPercent, rarityColor, rarityLabel } from "@/lib/rarity";
import type { Family, GameCard, Odds, Rarity } from "@/lib/types";
import { useEffect, useMemo, useRef, useState } from "react";

const blankFamily = (): Family => ({
  id: crypto.randomUUID(),
  name: "",
  color: "#c9a14a",
  description: "",
});

const blankCard = (familyId = ""): GameCard => ({
  id: crypto.randomUUID(),
  name: "",
  familyId,
  rarity: "commune",
  text: "",
  imageUrl: "",
});

export default function AtelierPage() {
  const [tab, setTab] = useState<"cartes" | "familles" | "chances">("cartes");
  const [families, setFamilies] = useState<Family[]>([]);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [odds, setOdds] = useState<Odds>(defaultOdds);
  const [family, setFamily] = useState<Family>(blankFamily());
  const [card, setCard] = useState<GameCard>(blankCard());
  const [status, setStatus] = useState("Prêt.");
  const [isNewCard, setIsNewCard] = useState(true);
  const [isNewFamily, setIsNewFamily] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const familyById = useMemo(
    () => Object.fromEntries(families.map((f) => [f.id, f])),
    [families],
  );

  useEffect(() => {
    fetchCatalog().then((data) => {
      setFamilies(data.families);
      setCards(data.cards);
      setOdds(data.odds);
      setCard((c) => ({ ...c, familyId: c.familyId || data.families[0]?.id || "" }));
    });
  }, []);

  function queue(action: () => Promise<void>) {
    if (timer.current) clearTimeout(timer.current);
    setStatus("Modification…");
    timer.current = setTimeout(async () => {
      await action();
      setStatus("Sauvé en direct.");
    }, 350);
  }

  function editCard(next: GameCard) {
    setCard(next);
    if (isNewCard) return;
    setCards((list) => list.map((c) => (c.id === next.id ? next : c)));
    queue(() => patchCatalog({ card: next }).then(() => undefined));
  }

  function editFamily(next: Family) {
    setFamily(next);
    if (isNewFamily) return;
    setFamilies((list) => list.map((f) => (f.id === next.id ? next : f)));
    queue(() => patchCatalog({ family: next }).then(() => undefined));
  }

  function editOdds(next: Odds) {
    setOdds(next);
    queue(() => patchCatalog({ odds: next }).then(() => undefined));
  }

  async function createCard() {
    if (!card.name.trim() || !card.familyId) {
      setStatus("Nom et famille obligatoires.");
      return;
    }
    const next = { ...card, name: card.name.trim() };
    const data = await patchCatalog({ card: next });
    setFamilies(data.families);
    setCards(data.cards);
    setOdds(data.odds);
    setIsNewCard(false);
    setStatus("Carte créée. Tu peux continuer à l’éditer en direct.");
  }

  async function createFamily() {
    if (!family.name.trim()) {
      setStatus("Nom obligatoire.");
      return;
    }
    const next = { ...family, name: family.name.trim() };
    const data = await patchCatalog({ family: next });
    setFamilies(data.families);
    setCards(data.cards);
    setOdds(data.odds);
    setIsNewFamily(false);
    setStatus("Famille créée. Les champs se sauvent tout seuls.");
  }

  async function removeCard(id: string) {
    const data = await patchCatalog({ deleteCardId: id });
    setFamilies(data.families);
    setCards(data.cards);
    if (card.id === id) startNewCard();
    setStatus("Carte supprimée.");
  }

  async function removeFamily(id: string) {
    const data = await patchCatalog({ deleteFamilyId: id });
    setFamilies(data.families);
    setCards(data.cards);
    if (family.id === id) startNewFamily();
    setStatus("Famille supprimée.");
  }

  function startNewCard() {
    setIsNewCard(true);
    setCard(blankCard(families[0]?.id ?? ""));
  }

  function startNewFamily() {
    setIsNewFamily(true);
    setFamily(blankFamily());
  }

  function openCard(item: GameCard) {
    setTab("cartes");
    setIsNewCard(false);
    setCard(item);
  }

  function openFamily(item: Family) {
    setTab("familles");
    setIsNewFamily(false);
    setFamily(item);
  }

  async function resetSeed() {
    const res = await fetch("/api/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset: true }),
    });
    const data = await res.json();
    setFamilies(data.families);
    setCards(data.cards);
    setOdds(data.odds);
    startNewCard();
    startNewFamily();
    setStatus("Exemple restauré.");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold)]">Base live</p>
          <h1 className="display text-4xl text-white">Atelier</h1>
          <p className="mt-1 max-w-xl text-sm text-stone-400">
            Clique une carte, change n’importe quel champ : c’est écrit tout de suite. Pas besoin de
            recharger.
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--gold)]">{status}</span>
          <button onClick={resetSeed} className="rounded-full border border-rose-400/30 px-3 py-1 text-rose-200">
            Restaurer l’exemple
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {(["cartes", "familles", "chances"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.2em] ${
              tab === key ? "gold-btn" : "panel"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {tab === "cartes" && (
        <section className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <form
            className="panel sticky top-4 h-fit space-y-3 rounded-3xl p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (isNewCard) createCard();
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--gold)]">{isNewCard ? "Nouvelle carte" : "Édition live"}</h2>
              {!isNewCard && (
                <button type="button" onClick={startNewCard} className="text-xs uppercase tracking-widest">
                  + Nouvelle
                </button>
              )}
            </div>
            <Field label="Nom">
              <input value={card.name} onChange={(e) => editCard({ ...card, name: e.target.value })} />
            </Field>
            <Field label="Famille">
              <select
                value={card.familyId}
                onChange={(e) => editCard({ ...card, familyId: e.target.value })}
              >
                <option value="">Choisir</option>
                {families.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Rareté">
              <select
                value={card.rarity}
                onChange={(e) => editCard({ ...card, rarity: e.target.value as Rarity })}
              >
                {RARITY_ORDER.map((r) => (
                  <option key={r} value={r}>
                    {rarityLabel[r]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Image (URL)">
              <input
                value={card.imageUrl}
                onChange={(e) => editCard({ ...card, imageUrl: e.target.value })}
                placeholder="https://…"
              />
            </Field>
            <Field label="Texte">
              <textarea
                rows={3}
                value={card.text}
                onChange={(e) => editCard({ ...card, text: e.target.value })}
              />
            </Field>
            <div className="flex justify-center py-2">
              <CardFace card={card} family={familyById[card.familyId]} />
            </div>
            {isNewCard ? (
              <button className="gold-btn w-full py-3">Créer la carte</button>
            ) : (
              <p className="text-center text-xs uppercase tracking-widest text-stone-500">
                Chaque frappe est enregistrée
              </p>
            )}
          </form>
          <div className="flex flex-wrap gap-4">
            {cards.map((item) => (
              <div key={item.id} className="relative">
                <CardFace
                  card={item}
                  family={familyById[item.familyId]}
                  selected={item.id === card.id && !isNewCard}
                  onClick={() => openCard(item)}
                />
                <button
                  onClick={() => removeCard(item.id)}
                  className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full bg-rose-800 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === "familles" && (
        <section className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <form
            className="panel sticky top-4 h-fit space-y-3 rounded-3xl p-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (isNewFamily) createFamily();
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-[var(--gold)]">{isNewFamily ? "Nouvelle famille" : "Édition live"}</h2>
              {!isNewFamily && (
                <button type="button" onClick={startNewFamily} className="text-xs uppercase tracking-widest">
                  + Nouvelle
                </button>
              )}
            </div>
            <Field label="Nom">
              <input value={family.name} onChange={(e) => editFamily({ ...family, name: e.target.value })} />
            </Field>
            <Field label="Couleur">
              <input
                type="color"
                className="h-12 w-full p-1"
                value={family.color}
                onChange={(e) => editFamily({ ...family, color: e.target.value })}
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={4}
                value={family.description}
                onChange={(e) => editFamily({ ...family, description: e.target.value })}
              />
            </Field>
            {isNewFamily ? (
              <button className="gold-btn w-full py-3">Créer la famille</button>
            ) : (
              <p className="text-center text-xs uppercase tracking-widest text-stone-500">
                Chaque frappe est enregistrée
              </p>
            )}
          </form>
          <div className="grid gap-3 sm:grid-cols-2">
            {families.map((item) => (
              <article
                key={item.id}
                className={`panel cursor-pointer rounded-3xl p-5 ${
                  item.id === family.id && !isNewFamily ? "ring-1 ring-[var(--gold)]" : ""
                }`}
                onClick={() => openFamily(item)}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="display text-2xl" style={{ color: item.color }}>
                    {item.name}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFamily(item.id);
                    }}
                    className="text-xs text-rose-300"
                  >
                    Supprimer
                  </button>
                </div>
                <p className="text-sm text-stone-400">{item.description}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-stone-500">
                  {cards.filter((c) => c.familyId === item.id).length} cartes
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "chances" && (
        <section className="panel mx-auto max-w-2xl space-y-6 rounded-[2rem] p-6">
          <div>
            <h2 className="display text-2xl text-white">Probabilités des packs</h2>
            <p className="mt-1 text-sm text-stone-400">
              Chaque carte du pack tire au sort avec ces poids. Pas besoin que ça fasse 100 : on
              normalise tout seul.
            </p>
          </div>
          {RARITY_ORDER.map((rarity) => (
            <div key={rarity} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span style={{ color: rarityColor[rarity] }}>{rarityLabel[rarity]}</span>
                <span className="flex items-center gap-2 text-stone-300">
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    className="w-20"
                    value={odds[rarity]}
                    onChange={(e) => editOdds({ ...odds, [rarity]: Number(e.target.value) })}
                  />
                  <span className="w-16 text-right">{oddsPercent(odds, rarity).toFixed(1)}%</span>
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.min(100, odds[rarity])}
                onChange={(e) => editOdds({ ...odds, [rarity]: Number(e.target.value) })}
                className="w-full accent-[var(--gold)]"
              />
            </div>
          ))}
          <p className="text-xs uppercase tracking-widest text-stone-500">Sauvé en direct, comme le reste</p>
        </section>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1 text-[10px] uppercase tracking-[0.22em] text-stone-400">
      {label}
      {children}
    </label>
  );
}
