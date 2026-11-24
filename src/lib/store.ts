import { db, emptyCollection } from "./db";
import { seedCards, seedFamilies } from "./seed";
import type { Collection, Family, GameCard } from "./types";

export async function catalog() {
  let [families, cards, collection] = await Promise.all([
    db.families.get(),
    db.cards.get(),
    db.collection.get(),
  ]);
  if (families.length === 0 && cards.length === 0) {
    families = seedFamilies;
    cards = seedCards;
    await Promise.all([db.families.set(families), db.cards.set(cards)]);
  }
  return { families, cards, collection };
}

export async function saveFamilies(rows: Family[]) {
  await db.families.set(rows);
  return rows;
}

export async function saveCards(rows: GameCard[]) {
  await db.cards.set(rows);
  return rows;
}

export async function saveCollection(value: Collection) {
  await db.collection.set(value);
  return value;
}

export async function resetCatalog() {
  await Promise.all([
    db.families.set(seedFamilies),
    db.cards.set(seedCards),
    db.collection.set(emptyCollection()),
  ]);
  return catalog();
}
