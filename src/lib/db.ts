import { promises as fs } from "fs";
import path from "path";
import cardsFallback from "../../data/cards.json";
import familiesFallback from "../../data/families.json";
import oddsFallback from "../../data/odds.json";
import { defaultOdds, sanitizeOdds } from "./rarity";
import type { Collection, Family, GameCard, Odds } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  const full = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(value, null, 2), "utf8");
  } catch {
    // Serverless hosts (Vercel) have a read-only filesystem.
  }
}

export const emptyCollection = (): Collection => ({ owned: {}, lastPackAt: null });

export function sanitizeCard(card: GameCard): GameCard {
  return {
    id: card.id,
    name: card.name,
    familyId: card.familyId,
    rarity: card.rarity,
    text: card.text ?? "",
    imageUrl: card.imageUrl ?? "",
  };
}

export const db = {
  families: {
    get: () => readJson<Family[]>("families.json", familiesFallback as Family[]),
    set: (rows: Family[]) => writeJson("families.json", rows),
  },
  cards: {
    get: async () => (await readJson<GameCard[]>("cards.json", cardsFallback as GameCard[])).map(sanitizeCard),
    set: (rows: GameCard[]) => writeJson("cards.json", rows.map(sanitizeCard)),
  },
  collection: {
    get: () => readJson<Collection>("collection.json", emptyCollection()),
    set: (value: Collection) => writeJson("collection.json", value),
  },
  odds: {
    get: async () => sanitizeOdds(await readJson<Odds>("odds.json", (oddsFallback as Odds) ?? defaultOdds)),
    set: (value: Odds) => writeJson("odds.json", sanitizeOdds(value)),
  },
};
