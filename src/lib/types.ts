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
  rarity: Rarity;
  text: string;
  imageUrl: string;
};

export type Odds = Record<Rarity, number>;

export type Collection = {
  owned: Record<string, number>;
  lastPackAt: number | null;
};

export type PackPull = {
  cardId: string;
  new: boolean;
};
