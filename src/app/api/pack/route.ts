import { NextResponse } from "next/server";
import { openPack } from "@/lib/pack";
import { PACK_COOLDOWN_MS } from "@/lib/rarity";
import { catalog } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST() {
  const data = await catalog();
  if (!data.cards.length) {
    return NextResponse.json({ error: "Le set est vide." }, { status: 400 });
  }

  const pulls = openPack(data.cards, {}, data.odds);
  return NextResponse.json(
    { pulls, waitMs: PACK_COOLDOWN_MS },
    { headers: { "Cache-Control": "no-store" } },
  );
}
