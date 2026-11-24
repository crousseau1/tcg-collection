import { NextResponse } from "next/server";
import { catalog, resetCatalog, saveCards, saveCollection, saveFamilies } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await catalog());
}

export async function POST(request: Request) {
  const body = await request.json();
  if (body.reset) return NextResponse.json(await resetCatalog());
  if (body.families) await saveFamilies(body.families);
  if (body.cards) await saveCards(body.cards);
  if (body.collection) await saveCollection(body.collection);
  return NextResponse.json(await catalog());
}
