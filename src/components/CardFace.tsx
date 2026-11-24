import { rarityColor, rarityLabel } from "@/lib/rarity";
import type { Family, GameCard } from "@/lib/types";

export function CardFace({
  card,
  family,
  compact = false,
  owned,
  fresh,
  onClick,
  disabled,
  selected,
}: {
  card: GameCard;
  family?: Family;
  compact?: boolean;
  owned?: number;
  fresh?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}) {
  const color = family?.color ?? "#64748b";
  const glow = rarityColor[card.rarity];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`card-glow relative overflow-hidden rounded-2xl text-left transition ${
        compact ? "h-40 w-28" : "h-64 w-44"
      } ${disabled ? "opacity-40 grayscale" : "hover:-translate-y-1"} ${
        selected ? "ring-2 ring-amber-300" : ""
      }`}
      style={{
        background: `linear-gradient(180deg, ${color}33, #0f1426 42%, #0b1020)`,
        border: `1px solid ${glow}`,
        boxShadow: `0 0 18px ${glow}55`,
      }}
    >
      <div
        className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-black"
        style={{ background: glow }}
      >
        {card.cost}
      </div>
      {owned != null && owned > 0 && (
        <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 text-xs">×{owned}</div>
      )}
      {fresh && (
        <div className="absolute right-2 top-2 rounded-full bg-amber-300 px-2 text-[10px] font-bold uppercase text-black">
          nouvelle
        </div>
      )}
      <div className={`${compact ? "h-16" : "h-24"} w-full`} style={{ background: `${color}55` }}>
        {card.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-3xl opacity-70">◆</div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className="truncate text-sm font-bold tracking-wide text-amber-100">{card.name}</p>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-70">{family?.name}</p>
        {!compact && <p className="line-clamp-3 text-xs opacity-80">{card.text}</p>}
        <p className="text-[10px] uppercase tracking-widest" style={{ color: glow }}>
          {rarityLabel[card.rarity]}
        </p>
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex justify-between text-sm font-bold">
        <span className="rounded bg-rose-700/80 px-2 py-0.5">{card.attack}</span>
        <span className="rounded bg-emerald-700/80 px-2 py-0.5">{card.health}</span>
      </div>
    </button>
  );
}
