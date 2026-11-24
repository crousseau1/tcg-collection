import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Collection TCG",
  description: "Crée tes cartes, ouvre des packs, collectionne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
          <header className="mb-8 flex items-center justify-between border-b border-[#2a3354] pb-4">
            <Link href="/" className="text-2xl tracking-[0.2em] text-amber-200">
              COLLECTION TCG
            </Link>
            <nav className="flex gap-5 text-sm uppercase tracking-widest text-slate-300">
              <Link href="/packs">Packs</Link>
              <Link href="/collection">Collection</Link>
              <Link href="/atelier">Atelier</Link>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
