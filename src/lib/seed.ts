import type { Family, GameCard } from "./types";

export const seedFamilies: Family[] = [
  {
    id: "emberveil",
    name: "Voile-Braise",
    color: "#e11d48",
    description: "Flammes et cendres.",
  },
  {
    id: "tideborn",
    name: "Marée-Née",
    color: "#0891b2",
    description: "Eaux profondes.",
  },
  {
    id: "thornwake",
    name: "Roncevive",
    color: "#16a34a",
    description: "Forêts et ronces.",
  },
];

export const seedCards: GameCard[] = [
  { id: "c1", name: "Étincelle", familyId: "emberveil", rarity: "commune", text: "Petite flamme pressée.", imageUrl: "" },
  { id: "c2", name: "Garde-Cendre", familyId: "emberveil", rarity: "commune", text: "Sentinelle du foyer.", imageUrl: "" },
  { id: "c3", name: "Lame-Forge", familyId: "emberveil", rarity: "rare", text: "Acier encore chaud.", imageUrl: "" },
  { id: "c4", name: "Wyrm de Magma", familyId: "emberveil", rarity: "epique", text: "Le souffle du brasier.", imageUrl: "" },
  { id: "c5", name: "Gouttevive", familyId: "tideborn", rarity: "commune", text: "Petite sentinelle d'eau.", imageUrl: "" },
  { id: "c6", name: "Veilleur du Rivage", familyId: "tideborn", rarity: "commune", text: "Garde la marée.", imageUrl: "" },
  { id: "c7", name: "Chasse-Écume", familyId: "tideborn", rarity: "rare", text: "Court sur les vagues.", imageUrl: "" },
  { id: "c8", name: "Léviathan d'Azur", familyId: "tideborn", rarity: "legendaire", text: "Une montagne qui nage.", imageUrl: "" },
  { id: "c9", name: "Pousse-Piège", familyId: "thornwake", rarity: "commune", text: "Minuscule mais tenace.", imageUrl: "" },
  { id: "c10", name: "Gardien de Lianes", familyId: "thornwake", rarity: "commune", text: "S'enracine.", imageUrl: "" },
  { id: "c11", name: "Traque-Ronce", familyId: "thornwake", rarity: "rare", text: "Bondit hors des ronces.", imageUrl: "" },
  { id: "c12", name: "Hydre Sylvestre", familyId: "thornwake", rarity: "epique", text: "Coupe une tête, deux reviennent.", imageUrl: "" },
];
