"use client";

import { useMode } from "@/components/ModeProvider";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const playerLinks = [
  { href: "/packs", label: "Packs" },
  { href: "/collection", label: "Collection" },
];

const adminLinks = [
  { href: "/packs", label: "Packs" },
  { href: "/collection", label: "Collection" },
  { href: "/atelier", label: "Atelier" },
];

export function Nav() {
  const path = usePathname();
  const router = useRouter();
  const { mode, setMode, ready } = useMode();
  const links = ready && mode === "admin" ? adminLinks : playerLinks;

  function switchMode(next: "player" | "admin") {
    setMode(next);
    if (next === "player" && path === "/atelier") router.push("/packs");
  }

  return (
    <header className="mb-10 flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="display text-xl text-[var(--gold)] md:text-2xl">
        Vault
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <nav className="panel flex gap-1 rounded-full p-1 text-xs uppercase tracking-[0.22em]">
          {links.map((link) => {
            const current = (path || "/").replace(/\/$/, "") || "/";
            const active = current === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 transition ${
                  active ? "bg-[var(--gold)] text-black" : "text-stone-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="panel flex rounded-full p-1 text-[10px] uppercase tracking-[0.18em]">
          <button
            onClick={() => switchMode("player")}
            className={`rounded-full px-3 py-2 ${mode === "player" ? "bg-[var(--gold)] text-black" : "text-stone-400"}`}
          >
            Joueur
          </button>
          <button
            onClick={() => switchMode("admin")}
            className={`rounded-full px-3 py-2 ${mode === "admin" ? "bg-[var(--gold)] text-black" : "text-stone-400"}`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
