import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { ICharacterType } from "../../Api";
import { cn } from "../../lib/utils";
import { clamp } from "./format";

interface HpBandProps {
  character: ICharacterType;
  patch: (
    updates: Partial<ICharacterType>,
    opts?: { debounce?: boolean },
  ) => void;
}

const injuryStyles: Record<string, string> = {
  Healthy: "bg-vitality-soft text-vitality-ink",
  Bloodied: "bg-harm-soft text-harm",
  Mangled: "bg-harm text-primary-foreground",
};

const HpBand = ({ character, patch }: HpBandProps) => {
  const [amount, setAmount] = useState("1");

  const total = character.total_hitpoints || 0;
  const current = character.current_hitpoints || 0;
  const temp = character.temp_hitpoints || 0;
  const thresholds = character.hp_thresholds ?? {
    bloodied: 0.5,
    mangled: 0.25,
  };

  const delta = Math.max(0, parseInt(amount, 10) || 0);
  const setHp = (next: number) =>
    patch({ current_hitpoints: clamp(next, 0, total) }, { debounce: false });

  const pct = total > 0 ? (current / total) * 100 : 0;
  const tempPct = total > 0 ? (temp / total) * 100 : 0;

  const hitDie = character.hit_die || character.hit_die_type || "d8";
  const conMod = character.constitution?.modifier ?? 0;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 lg:flex-row lg:items-center lg:gap-6 lg:px-[18px] lg:py-[14px]">
      {/* HP + bar */}
      <div className="flex w-full flex-col gap-[7px] lg:w-[400px] lg:flex-shrink-0">
        <div className="flex items-baseline gap-[9px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Hit points
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.1em]",
              injuryStyles[character.injury_condition] ?? injuryStyles.Healthy,
            )}
          >
            {character.injury_condition}
          </span>
          <span className="ml-auto font-mono text-[11px] text-muted-foreground">
            Bloodied {Math.floor(total * thresholds.bloodied)} · Mangled{" "}
            {Math.floor(total * thresholds.mangled)}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[36px] font-semibold leading-none">
            {current}
          </span>
          <span className="font-mono text-[16px] text-muted-foreground">
            / {total}
          </span>
          {temp > 0 && (
            <span className="ml-2 rounded-full bg-arcane-soft px-[9px] py-1 font-mono text-[13px] text-arcane-ink">
              +{temp} temp
            </span>
          )}
        </div>
        <div className="relative h-3">
          <div className="flex h-3 overflow-hidden rounded-full bg-border-strong">
            <div className="h-3 bg-harm" style={{ width: `${pct}%` }} />
            <div className="h-3 bg-arcane" style={{ width: `${tempPct}%` }} />
          </div>
          <span
            className="absolute top-[-3px] h-[18px] w-[2px] rounded-sm bg-proficiency"
            style={{ left: `${thresholds.bloodied * 100}%` }}
          />
          <span
            className="absolute top-[-3px] h-[18px] w-[2px] rounded-sm bg-harm"
            style={{ left: `${thresholds.mangled * 100}%` }}
          />
        </div>
      </div>

      {/* Damage / amount / heal */}
      <div className="flex items-center gap-[9px]">
        <button
          type="button"
          aria-label="Take damage"
          onClick={() => setHp(current - delta)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-harm/30 bg-harm-soft text-harm"
        >
          <Minus className="h-5 w-5" />
        </button>
        <div className="flex flex-col gap-[3px]">
          <label
            htmlFor="hpdelta"
            className="text-center font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground"
          >
            Amount
          </label>
          <input
            id="hpdelta"
            type="text"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
            className="min-h-[44px] w-[66px] rounded-[10px] border border-border bg-secondary p-[10px] text-center font-mono text-[17px]"
          />
        </div>
        <button
          type="button"
          aria-label="Heal"
          onClick={() => setHp(current + delta)}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-vitality/30 bg-vitality-soft text-vitality-ink"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="hidden h-[50px] w-px bg-hairline lg:block" />

      {/* Hit dice */}
      <div className="flex flex-col gap-[5px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Hit dice
        </span>
        <span className="font-mono text-[16px]">
          {character.hit_dice_remaining ?? character.level} / {character.level}{" "}
          {hitDie}
        </span>
      </div>

      {/* Death saves (read-only in Phase 2) */}
      <div className="flex flex-col gap-[6px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Death saves
        </span>
        <div className="flex gap-[5px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                "h-[15px] w-[15px] rounded-full border-[1.5px] border-border-strong",
                i < character.death_save_failures && "border-harm bg-harm",
              )}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[5px] lg:ml-auto lg:items-end">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Rest recovery
        </span>
        <span className="font-mono text-[13px] text-foreground-2">
          {hitDie}+{conMod} × {character.level}
        </span>
      </div>
    </div>
  );
};

export default HpBand;
