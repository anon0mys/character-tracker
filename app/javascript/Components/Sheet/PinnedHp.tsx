import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { ICharacterType } from "../../Api";
import { cn } from "../../lib/utils";
import { clamp } from "./format";
import { getPinHp } from "../Shell/appearance";

interface PinnedHpProps {
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

// Phone-only HP strip. Sticky under the header when the viewer keeps the
// "pin HP" preference on. The page (document) is the scroll container, so
// position: sticky is iOS-safe here.
const PinnedHp = ({ character, patch }: PinnedHpProps) => {
  const [amount, setAmount] = useState("1");
  const total = character.total_hitpoints || 0;
  const current = character.current_hitpoints || 0;
  const temp = character.temp_hitpoints || 0;
  const thresholds = character.hp_thresholds ?? {
    bloodied: 0.5,
    mangled: 0.25,
  };
  const delta = Math.max(0, parseInt(amount, 10) || 0);
  const setHp = (n: number) =>
    patch({ current_hitpoints: clamp(n, 0, total) }, { debounce: false });
  const pct = total > 0 ? (current / total) * 100 : 0;
  const tempPct = total > 0 ? (temp / total) * 100 : 0;

  return (
    <div
      className={cn(
        "z-30 flex items-center gap-[11px] border-b border-border bg-card px-[14px] py-[10px] lg:hidden",
        getPinHp() && "sticky top-[52px]",
      )}
    >
      <div className="flex min-w-0 flex-grow flex-col gap-[5px]">
        <div className="flex items-baseline gap-[7px]">
          <span className="font-mono text-[26px] font-semibold leading-none">
            {current}
          </span>
          <span className="font-mono text-[13px] text-muted-foreground">
            / {total}
          </span>
          {temp > 0 && (
            <span className="rounded-full bg-arcane-soft px-[7px] py-[3px] font-mono text-[10.5px] text-arcane-ink">
              +{temp}
            </span>
          )}
          <span
            className={cn(
              "ml-auto rounded-full px-[7px] py-[3px] font-mono text-[9.5px] uppercase tracking-[0.08em]",
              injuryStyles[character.injury_condition] ?? injuryStyles.Healthy,
            )}
          >
            {character.injury_condition}
          </span>
        </div>
        <div className="relative h-[10px]">
          <div className="flex h-[10px] overflow-hidden rounded-full bg-border-strong">
            <div className="h-[10px] bg-harm" style={{ width: `${pct}%` }} />
            <div
              className="h-[10px] bg-arcane"
              style={{ width: `${tempPct}%` }}
            />
          </div>
          <span
            className="absolute top-[-3px] h-[16px] w-[2px] rounded-sm bg-proficiency"
            style={{ left: `${thresholds.bloodied * 100}%` }}
          />
          <span
            className="absolute top-[-3px] h-[16px] w-[2px] rounded-sm bg-harm"
            style={{ left: `${thresholds.mangled * 100}%` }}
          />
        </div>
      </div>
      <input
        aria-label="Amount"
        type="text"
        inputMode="numeric"
        value={amount}
        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
        className="h-[46px] w-[44px] flex-shrink-0 rounded-[10px] border border-border bg-secondary text-center font-mono text-[15px]"
      />
      <button
        type="button"
        aria-label="Take damage"
        onClick={() => setHp(current - delta)}
        className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl border border-harm/30 bg-harm-soft text-harm"
      >
        <Minus className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Heal"
        onClick={() => setHp(current + delta)}
        className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-xl border border-vitality/30 bg-vitality-soft text-vitality-ink"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
};

export default PinnedHp;
