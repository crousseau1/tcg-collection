import { NextResponse } from "next/server";
import { openPack } from "@/lib/pack";
import { PACK_COOLDOWN_MS } from "@/lib/rarity";
import { catalog, saveCollection } from "@/lib/store";

export async function POST() {
  const data = await catalog();
  if (!data.cards.length) {
    return NextResponse.json({ error: "Ajoute des cartes dans l’atelier d’abord." }, { status: 400 });
  }

  const now = Date.now();
  const last = data.collection.lastPackAt ?? 0;
  const waitMs = PACK_COOLDOWN_MS - (now - last);
  if (last && waitMs > 0) {
    return NextResponse.json(
      { error: "Pas encore.", waitMs, collection: data.collection },
      { status: 429 },
    );
  }

  const pulls = openPack(data.cards, data.collection.owned);
  const owned = { ...data.collection.owned };
  for (const pull of pulls) owned[pull.cardId] = (owned[pull.cardId] ?? 0) + 1;
  const collection = { owned, lastPackAt: now };
  await saveCollection(collection);
  return NextResponse.json({ pulls, collection, waitMs: PACK_COOLDOWN_MS });
}
