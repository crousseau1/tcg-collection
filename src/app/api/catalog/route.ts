import { NextResponse } from "next/server";
import { catalog, resetCatalog, saveCards, saveCollection, saveFamilies, saveOdds } from "@/lib/store";
import type { Family, GameCard, Odds } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function GET() {
  return json(await catalog());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.reset) return json(await resetCatalog());
  if (body.families) await saveFamilies(body.families);
  if (body.cards) await saveCards(body.cards);
  if (body.collection) await saveCollection(body.collection);
  if (body.odds) await saveOdds(body.odds);
  return json(await catalog());
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const data = await catalog();

  if (body.family) {
    const incoming = body.family as Family;
    const exists = data.families.some((f) => f.id === incoming.id);
    const families = exists
      ? data.families.map((f) => (f.id === incoming.id ? { ...f, ...incoming } : f))
      : [...data.families, incoming];
    await saveFamilies(families);
  }

  if (body.card) {
    const incoming = body.card as GameCard;
    const exists = data.cards.some((c) => c.id === incoming.id);
    const cards = exists
      ? data.cards.map((c) => (c.id === incoming.id ? { ...c, ...incoming } : c))
      : [...data.cards, incoming];
    await saveCards(cards);
  }

  if (body.odds) await saveOdds(body.odds as Odds);

  if (body.deleteFamilyId) {
    await saveFamilies(data.families.filter((f) => f.id !== body.deleteFamilyId));
    await saveCards(data.cards.filter((c) => c.familyId !== body.deleteFamilyId));
  }

  if (body.deleteCardId) {
    await saveCards(data.cards.filter((c) => c.id !== body.deleteCardId));
  }

  return json(await catalog());
}
