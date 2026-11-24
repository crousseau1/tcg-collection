import type { Collection } from "./types";

const KEY = "vault-collection";

export function emptyCollection(): Collection {
  return { owned: {}, lastPackAt: null };
}

export function loadCollection(): Collection {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return emptyCollection();
    const parsed = JSON.parse(raw) as Collection;
    return {
      owned: parsed.owned ?? {},
      lastPackAt: parsed.lastPackAt ?? null,
    };
  } catch {
    return emptyCollection();
  }
}

export function saveCollection(collection: Collection) {
  window.localStorage.setItem(KEY, JSON.stringify(collection));
}
