"use client";

import { CardFace } from "@/components/CardFace";
import type { Family, GameCard, Rarity } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

const emptyFamily: Family = { id: "", name: "", color: "#e11d48", description: "" };
const emptyCard: Omit<GameCard, "id"> = {
  name: "",
  familyId: "",
  cost: 1,
  attack: 1,
  health: 1,
  rarity: "commune",
  text: "",
  imageUrl: "",
};

export default function AtelierPage() {
  const [tab, setTab] = useState<"familles" | "cartes">("cartes");
  const [families, setFamilies] = useState<Family[]>([]);
  const [cards, setCards] = useState<GameCard[]>([]);
  const [familyForm, setFamilyForm] = useState(emptyFamily);
  const [cardForm, setCardForm] = useState(emptyCard);
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/catalog");
    const data = await res.json();
    setFamilies(data.families);
    setCards(data.cards);
  }

  useEffect(() => {
    load();
  }, []);

  async function persist(next?: { families?: Family[]; cards?: GameCard[] }) {
    const payload = {
      families: next?.families ?? families,
      cards: next?.cards ?? cards,
    };
    const res = await fetch("/api/catalog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setFamilies(data.families);
    setCards(data.cards);
    setStatus("Enregistré.");
  }

  const familyById = useMemo(
    () => Object.fromEntries(families.map((f) => [f.id, f])),
    [families],
  );

  async function addFamily() {
    if (!familyForm.name.trim()) return;
    const next = [
      ...families,
      { ...familyForm, id: crypto.randomUUID(), name: familyForm.name.trim() },
    ];
    setFamilyForm(emptyFamily);
    await persist({ families: next });
  }

  async function removeFamily(id: string) {
    await persist({
      families: families.filter((f) => f.id !== id),
      cards: cards.filter((c) => c.familyId !== id),
    });
  }

  async function addCard() {
    if (!cardForm.name.trim() || !cardForm.familyId) return;
    const next = [...cards, { ...cardForm, id: crypto.randomUUID(), name: cardForm.name.trim() }];
    setCardForm({ ...emptyCard, familyId: cardForm.familyId, rarity: cardForm.rarity });
    await persist({ cards: next });
  }

  async function removeCard(id: string) {
    await persist({ cards: cards.filter((c) => c.id !== id) });
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
    setStatus("Exemple restauré. Collection vidée.");
  }

  return (
    <div className="space-y-6">
      <p className="text-slate-300">
        C’est ici que tu choisis tout : familles, cartes, raretés. Les packs piochent uniquement
        dans ce que tu as créé.
      </p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["cartes", "familles"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-xs uppercase tracking-widest ${
                tab === key ? "bg-amber-300 text-black" : "border border-[#2a3354]"
              }`}
            >
              {key}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="opacity-70">{status}</span>
          <button onClick={resetSeed} className="rounded-full border border-rose-400/40 px-3 py-1 text-rose-200">
            Restaurer l’exemple
          </button>
        </div>
      </div>

      {tab === "familles" && (
        <section className="grid gap-6 md:grid-cols-[320px_1fr]">
          <form
            className="card-glow space-y-3 rounded-2xl border border-[#2a3354] bg-[#141a2e] p-4"
            onSubmit={(e) => {
              e.preventDefault();
              addFamily();
            }}
          >
            <h2 className="text-amber-200">Nouvelle famille</h2>
            <input
              className="w-full rounded bg-[#0b1020] p-2"
              placeholder="Nom"
              value={familyForm.name}
              onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })}
            />
            <label className="flex items-center gap-3 text-sm">
              Couleur
              <input
                className="h-10 w-16 rounded bg-[#0b1020]"
                type="color"
                value={familyForm.color}
                onChange={(e) => setFamilyForm({ ...familyForm, color: e.target.value })}
              />
            </label>
            <textarea
              className="w-full rounded bg-[#0b1020] p-2"
              placeholder="Description"
              value={familyForm.description}
              onChange={(e) => setFamilyForm({ ...familyForm, description: e.target.value })}
            />
            <button className="w-full rounded-full bg-amber-300 py-2 font-bold text-black">Ajouter</button>
          </form>
          <div className="grid gap-3 sm:grid-cols-2">
            {families.map((family) => (
              <article key={family.id} className="rounded-2xl border border-[#2a3354] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl" style={{ color: family.color }}>
                    {family.name}
                  </h3>
                  <button onClick={() => removeFamily(family.id)} className="text-xs text-rose-300">
                    Supprimer
                  </button>
                </div>
                <p className="text-sm opacity-75">{family.description}</p>
                <p className="mt-2 text-xs uppercase tracking-widest opacity-50">
                  {cards.filter((c) => c.familyId === family.id).length} cartes
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "cartes" && (
        <section className="grid gap-6 md:grid-cols-[320px_1fr]">
          <form
            className="card-glow space-y-3 rounded-2xl border border-[#2a3354] bg-[#141a2e] p-4"
            onSubmit={(e) => {
              e.preventDefault();
              addCard();
            }}
          >
            <h2 className="text-amber-200">Nouvelle carte</h2>
            <input
              className="w-full rounded bg-[#0b1020] p-2"
              placeholder="Nom"
              value={cardForm.name}
              onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
            />
            <select
              className="w-full rounded bg-[#0b1020] p-2"
              value={cardForm.familyId}
              onChange={(e) => setCardForm({ ...cardForm, familyId: e.target.value })}
            >
              <option value="">Famille</option>
              {families.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            <select
              className="w-full rounded bg-[#0b1020] p-2"
              value={cardForm.rarity}
              onChange={(e) => setCardForm({ ...cardForm, rarity: e.target.value as Rarity })}
            >
              <option value="commune">Commune — tombe souvent</option>
              <option value="rare">Rare</option>
              <option value="epique">Épique</option>
              <option value="legendaire">Légendaire — très rare</option>
            </select>
            <div className="grid grid-cols-3 gap-2">
              <label className="text-xs">
                Coût
                <input
                  type="number"
                  min={0}
                  className="w-full rounded bg-[#0b1020] p-2"
                  value={cardForm.cost}
                  onChange={(e) => setCardForm({ ...cardForm, cost: Number(e.target.value) })}
                />
              </label>
              <label className="text-xs">
                Attaque
                <input
                  type="number"
                  min={0}
                  className="w-full rounded bg-[#0b1020] p-2"
                  value={cardForm.attack}
                  onChange={(e) => setCardForm({ ...cardForm, attack: Number(e.target.value) })}
                />
              </label>
              <label className="text-xs">
                Vie
                <input
                  type="number"
                  min={1}
                  className="w-full rounded bg-[#0b1020] p-2"
                  value={cardForm.health}
                  onChange={(e) => setCardForm({ ...cardForm, health: Number(e.target.value) })}
                />
              </label>
            </div>
            <input
              className="w-full rounded bg-[#0b1020] p-2"
              placeholder="URL d’image (optionnel)"
              value={cardForm.imageUrl}
              onChange={(e) => setCardForm({ ...cardForm, imageUrl: e.target.value })}
            />
            <textarea
              className="w-full rounded bg-[#0b1020] p-2"
              placeholder="Texte de carte"
              value={cardForm.text}
              onChange={(e) => setCardForm({ ...cardForm, text: e.target.value })}
            />
            <button className="w-full rounded-full bg-amber-300 py-2 font-bold text-black">Ajouter</button>
          </form>
          <div className="flex flex-wrap gap-3">
            {cards.map((card) => (
              <div key={card.id} className="relative">
                <CardFace card={card} family={familyById[card.familyId]} />
                <button
                  onClick={() => removeCard(card.id)}
                  className="absolute -right-1 -top-1 rounded-full bg-rose-700 px-2 text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
