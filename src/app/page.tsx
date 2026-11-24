import Link from "next/link";

export default function HomePage() {
  return (
    <section className="grid gap-8 md:grid-cols-2">
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-[0.35em] text-amber-300">Collection</p>
        <h1 className="text-5xl leading-tight text-white">Tes cartes. Tes packs. Tes raretés.</h1>
        <p className="max-w-md text-lg text-slate-300">
          Invente les familles et les cartes dans l’atelier, puis ouvre un pack par minute. Les
          communes tombent souvent, les légendaires presque jamais.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/packs"
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-bold uppercase tracking-widest text-black"
          >
            Ouvrir un pack
          </Link>
          <Link
            href="/atelier"
            className="rounded-full border border-amber-300/40 px-5 py-3 text-sm uppercase tracking-widest"
          >
            Choisir les cartes
          </Link>
        </div>
      </div>
      <div className="card-glow rounded-3xl border border-[#2a3354] bg-[#141a2e] p-6">
        <p className="mb-4 text-sm uppercase tracking-widest text-amber-200">Dans un pack de 5</p>
        <ul className="space-y-3 text-slate-300">
          <li>3 cartes plutôt communes</li>
          <li>1 carte rare ou mieux</li>
          <li>1 carte rare / épique / légendaire</li>
          <li>1 pack toutes les 60 secondes</li>
        </ul>
      </div>
    </section>
  );
}
