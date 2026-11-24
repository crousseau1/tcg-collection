"use client";

import { useMode } from "@/components/ModeProvider";
import Link from "next/link";

export default function HomePage() {
  const { mode } = useMode();
  const admin = mode === "admin";

  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--gold)]">
          {admin ? "Mode administrateur" : "Mode joueur"}
        </p>
        <h1 className="display text-5xl leading-tight text-white md:text-6xl">
          {admin ? (
            <>
              Crée le set.
              <br />
              Règle les chances.
            </>
          ) : (
            <>
              Ouvre des packs.
              <br />
              Collectionne.
            </>
          )}
        </h1>
        <p className="max-w-md text-lg leading-relaxed text-stone-400">
          {admin
            ? "Atelier : familles, cartes, raretés, probabilités. Tout se sauve en direct."
            : "Un pack toutes les 60 secondes. Complète l’album. Passe en Admin pour modifier le set."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/packs" className="gold-btn px-6 py-3 text-sm">
            Ouvrir un pack
          </Link>
          {admin ? (
            <Link href="/atelier" className="panel rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]">
              Atelier
            </Link>
          ) : (
            <Link href="/collection" className="panel rounded-full px-6 py-3 text-sm uppercase tracking-[0.18em]">
              Collection
            </Link>
          )}
        </div>
      </div>
      <div className="panel rounded-[2rem] p-8">
        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-[var(--gold)]">
          {admin ? "Outils" : "Règles"}
        </p>
        <ul className="space-y-4 text-stone-300">
          {admin ? (
            <>
              <Row tone="#94a3b8" title="Cartes" text="Même format portrait pour toutes." />
              <Row tone="#c084fc" title="Chances" text="Tu fixes le % de chaque rareté." />
              <Row tone="#e8c36a" title="Joueur" text="Le bouton Joueur cache l’atelier." />
            </>
          ) : (
            <>
              <Row tone="#94a3b8" title="Pack" text="5 cartes, une fois par minute." />
              <Row tone="#c084fc" title="Album" text="Les cartes manquantes restent grisées." />
              <Row tone="#e8c36a" title="Raretés" text="Les légendaires tombent selon les chances du set." />
            </>
          )}
        </ul>
      </div>
    </section>
  );
}

function Row({ tone, title, text }: { tone: string; title: string; text: string }) {
  return (
    <li className="flex gap-4">
      <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ background: tone, boxShadow: `0 0 10px ${tone}` }} />
      <div>
        <p className="display text-lg text-white">{title}</p>
        <p className="text-sm text-stone-400">{text}</p>
      </div>
    </li>
  );
}
