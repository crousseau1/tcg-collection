export type Rarity = "commune" | "rare" | "epique" | "legendaire";

export type Family = {
  id: string;
  name: string;
  color: string;
  description: string;
};

export type GameCard = {
  id: string;
  name: string;
  familyId: string;
  cost: number;
  attack: number;
  health: number;
  rarity: Rarity;
  text: string;
  imageUrl: string;
};

export type Collection = {
  owned: Record<string, number>;
  lastPackAt: number | null;
};

export type PackPull = {
  cardId: string;
  new: boolean;
};
