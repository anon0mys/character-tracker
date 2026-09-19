import React from "react";
import { ICharacterType } from "../../Api";
import { cn } from "../../lib/utils";
import { signed } from "./format";

const CombatCard = ({ character }: { character: ICharacterType }) => {
  const tiles: {
    label: string;
    value: string;
    sub?: string;
    tone?: "default" | "arcane" | "brass";
  }[] = [
    { label: "Armor class", value: `${character.ac}` },
    { label: "Initiative", value: signed(character.initiative), sub: "dex" },
    {
      label: "Speed",
      value: `${character.speed}`,
      sub: `${Math.floor(character.speed / 5)} sq`,
    },
    {
      label: "Proficiency",
      value: signed(character.proficiency_bonus),
      sub: `level ${character.level}`,
      tone: "brass",
    },
    {
      label: "Passive perc.",
      value: `${character.perception}`,
      sub: "10 + wis",
    },
    {
      label: "Spell save DC",
      value: `${character.spell_save_dc}`,
      sub: "8 + prof + int",
      tone: "arcane",
    },
    {
      label: "Spell attack",
      value: signed(character.spell_attack_mod),
      sub: "prof + int",
      tone: "arcane",
    },
    {
      label: "Concentration",
      value: signed(character.concentration),
      sub: "con save",
      tone: "arcane",
    },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-[9px] rounded-2xl border border-border bg-card p-[13px] lg:flex-grow">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Combat &amp; casting
      </span>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tiles.map(({ label, value, sub, tone = "default" }) => (
          <div
            key={label}
            className={cn(
              "flex flex-col gap-[2px] rounded-[10px] border p-[9px_10px]",
              tone === "arcane"
                ? "border-arcane/30 bg-arcane-soft"
                : "border-hairline bg-secondary",
            )}
          >
            <span
              className={cn(
                "font-mono text-[9px] uppercase tracking-[0.08em]",
                tone === "arcane" ? "text-arcane-ink" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            <span
              className={cn(
                "font-mono text-[24px] font-semibold leading-none",
                tone === "arcane" && "text-arcane-ink",
                tone === "brass" && "text-proficiency",
              )}
            >
              {value}
            </span>
            {sub && (
              <span
                className={cn(
                  "font-mono text-[9px]",
                  tone === "arcane"
                    ? "text-arcane-ink/80"
                    : "text-muted-foreground",
                )}
              >
                {sub}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CombatCard;
