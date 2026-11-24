export function fetchCatalog() {
  return fetch("/api/catalog", { cache: "no-store" }).then((r) => r.json());
}

export function patchCatalog(body: unknown) {
  return fetch("/api/catalog", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify(body),
  }).then((r) => r.json());
}
