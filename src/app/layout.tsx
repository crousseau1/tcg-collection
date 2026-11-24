import type { Metadata } from "next";
import { Cinzel, Outfit } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "@/components/ModeProvider";
import { Nav } from "@/components/Nav";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-display" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-ui" });

export const metadata: Metadata = {
  title: "Vault — Collection TCG",
  description: "Crée tes cartes, ouvre des packs, collectionne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${cinzel.variable} ${outfit.variable}`}>
        <ModeProvider>
          <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6">
            <Nav />
            <main className="flex-1 pb-12">{children}</main>
          </div>
        </ModeProvider>
      </body>
    </html>
  );
}
