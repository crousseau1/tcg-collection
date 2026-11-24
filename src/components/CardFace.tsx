import { rarityColor, rarityLabel } from "@/lib/rarity";
import type { Family, GameCard } from "@/lib/types";

export function CardFace({
  card,
  family,
  owned,
  fresh,
  onClick,
  disabled,
  selected,
}: {
  card: GameCard;
  family?: Family;
  owned?: number;
  fresh?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}) {
  const color = family?.color ?? "#8b7355";
  const glow = rarityColor[card.rarity];
  const shiny = card.rarity === "epique" || card.rarity === "legendaire";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !onClick}
      className={`card-portrait relative overflow-hidden rounded-[1.25rem] text-left transition duration-300 ${
        disabled ? "opacity-35 grayscale" : "hover:-translate-y-1.5"
      } ${selected ? "ring-2 ring-[var(--gold)]" : ""} ${shiny ? "foil" : ""}`}
      style={{
        background: `linear-gradient(165deg, ${color}55, #120e18 38%, #09070e)`,
        border: `1px solid ${glow}`,
        boxShadow: selected
          ? `0 0 0 1px ${glow}, 0 16px 40px ${glow}40`
          : `0 14px 30px rgba(0,0,0,.45), 0 0 18px ${glow}33`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-[5px] rounded-[1rem]"
        style={{ boxShadow: `inset 0 0 0 1px ${glow}66` }}
      />
      {owned != null && owned > 0 && !fresh && (
        <div className="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/70 px-2 py-0.5 text-[11px] tracking-widest">
          ×{owned}
        </div>
      )}
      {fresh && (
        <div className="absolute right-2.5 top-2.5 z-10 rounded-full bg-[var(--gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-black">
          nouvelle
        </div>
      )}
      <div
        className="card-art mx-2.5 mt-2.5 overflow-hidden rounded-xl"
        style={{ background: `linear-gradient(180deg, ${color}99, #1a1424)` }}
      >
        {card.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={card.imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-4xl" style={{ color: glow }}>
            ◆
          </div>
        )}
      </div>
      <div className="card-body flex min-h-0 flex-1 flex-col px-3 py-2.5">
        <p className="display truncate text-[0.95rem] leading-tight text-[#f6ead0]">{card.name || "Sans nom"}</p>
        <p className="mt-1 truncate text-[10px] uppercase tracking-[0.2em] text-stone-400">
          {family?.name || "Sans famille"}
        </p>
        <p className="mt-2 line-clamp-3 min-h-0 flex-1 text-xs leading-relaxed text-stone-300">{card.text}</p>
        <p
          className="mt-2 w-fit rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black"
          style={{ background: glow }}
        >
          {rarityLabel[card.rarity]}
        </p>
      </div>
    </button>
  );
}
