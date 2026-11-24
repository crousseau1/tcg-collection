import { promises as fs } from "fs";
import path from "path";
import type { Collection, Family, GameCard } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  const full = path.join(DATA_DIR, file);
  try {
    const raw = await fs.readFile(full, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(full, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

async function writeJson<T>(file: string, value: T) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, file), JSON.stringify(value, null, 2), "utf8");
}

export const emptyCollection = (): Collection => ({ owned: {}, lastPackAt: null });

export const db = {
  families: {
    get: () => readJson<Family[]>("families.json", []),
    set: (rows: Family[]) => writeJson("families.json", rows),
  },
  cards: {
    get: () => readJson<GameCard[]>("cards.json", []),
    set: (rows: GameCard[]) => writeJson("cards.json", rows),
  },
  collection: {
    get: () => readJson<Collection>("collection.json", emptyCollection()),
    set: (value: Collection) => writeJson("collection.json", value),
  },
};
