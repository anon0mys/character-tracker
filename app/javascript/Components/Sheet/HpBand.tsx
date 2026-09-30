import React, { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
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
  const now = (u: Partial<ICharacterType>) => patch(u, { debounce: false });
  const setHp = (next: number) =>
    now({ current_hitpoints: clamp(next, 0, total) });

  const pct = total > 0 ? (current / total) * 100 : 0;
  const tempPct = total > 0 ? (temp / total) * 100 : 0;
  const hitDie = character.hit_die || character.hit_die_type || "d8";
  const conMod = character.constitution?.modifier ?? 0;
  const hitDiceLeft = character.hit_dice_remaining ?? character.level;

  // death save circle: click sets count to i+1, or clears the top one
  const saveClick = (
    field: "death_save_successes" | "death_save_failures",
    i: number,
  ) => {
    const cur = character[field] as number;
    now({ [field]: i + 1 === cur ? i : i + 1 } as Partial<ICharacterType>);
  };

  const removeCondition = (name: string) =>
    now({ conditions: (character.conditions ?? []).filter((c) => c !== name) });
  const addCondition = () => {
    const name = window.prompt("Condition");
    if (name && name.trim()) {
      now({ conditions: [...(character.conditions ?? []), name.trim()] });
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        {/* HP + bar */}
        <div className="flex w-full flex-col gap-[7px] lg:w-[400px] lg:flex-shrink-0">
          <div className="flex items-baseline gap-[9px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Hit points
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.1em]",
                injuryStyles[character.injury_condition] ??
                  injuryStyles.Healthy,
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

        {/* Temp HP */}
        <div className="flex flex-col gap-[5px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Temp HP
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Less temp"
              onClick={() => now({ temp_hitpoints: Math.max(0, temp - 1) })}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-[15px]">{temp}</span>
            <button
              type="button"
              aria-label="More temp"
              onClick={() => now({ temp_hitpoints: temp + 1 })}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Hit dice */}
        <div className="flex flex-col gap-[5px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Hit dice
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Spend hit die"
              onClick={() =>
                now({
                  hit_dice_remaining: clamp(
                    hitDiceLeft - 1,
                    0,
                    character.level,
                  ),
                })
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-[15px]">
              {hitDiceLeft} / {character.level} {hitDie}
            </span>
            <button
              type="button"
              aria-label="Restore hit die"
              onClick={() =>
                now({
                  hit_dice_remaining: clamp(
                    hitDiceLeft + 1,
                    0,
                    character.level,
                  ),
                })
              }
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Death saves */}
        <div className="flex flex-col gap-[6px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Death saves
          </span>
          <div className="flex items-center gap-3">
            <div className="flex gap-[5px]">
              {[0, 1, 2].map((i) => (
                <button
                  key={`s${i}`}
                  type="button"
                  aria-label={`Success ${i + 1}`}
                  onClick={() => saveClick("death_save_successes", i)}
                  className={cn(
                    "h-[15px] w-[15px] rounded-full border-[1.5px] border-border-strong",
                    i < character.death_save_successes &&
                      "border-vitality bg-vitality",
                  )}
                />
              ))}
            </div>
            <div className="flex gap-[5px]">
              {[0, 1, 2].map((i) => (
                <button
                  key={`f${i}`}
                  type="button"
                  aria-label={`Failure ${i + 1}`}
                  onClick={() => saveClick("death_save_failures", i)}
                  className={cn(
                    "h-[15px] w-[15px] rounded-full border-[1.5px] border-border-strong",
                    i < character.death_save_failures && "border-harm bg-harm",
                  )}
                />
              ))}
            </div>
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

      {/* Conditions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-hairline pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Conditions
        </span>
        {(character.conditions ?? []).map((c) => (
          <span
            key={c}
            className="flex items-center gap-1 rounded-full bg-arcane-soft px-[10px] py-1 text-[12px] text-arcane-ink"
          >
            {c}
            <button
              type="button"
              aria-label={`Remove ${c}`}
              onClick={() => removeCondition(c)}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={addCondition}
          className="min-h-[28px] rounded-full border border-dashed border-border-strong px-3 text-[12px] text-foreground-2"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default HpBand;
