import { db, emptyCollection } from "./db";
import { defaultOdds } from "./rarity";
import { seedCards, seedFamilies } from "./seed";
import type { Collection, Family, GameCard, Odds } from "./types";

export async function catalog() {
  let [families, cards, collection, odds] = await Promise.all([
    db.families.get(),
    db.cards.get(),
    db.collection.get(),
    db.odds.get(),
  ]);
  if (families.length === 0) {
    families = seedFamilies;
    await db.families.set(families);
  }
  if (cards.length === 0) {
    cards = seedCards;
    await db.cards.set(cards);
  }
  return { families, cards, collection, odds };
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

export async function saveOdds(value: Odds) {
  await db.odds.set(value);
  return value;
}

export async function resetCatalog() {
  await Promise.all([
    db.families.set(seedFamilies),
    db.cards.set(seedCards),
    db.collection.set(emptyCollection()),
    db.odds.set(defaultOdds),
  ]);
  return catalog();
}
