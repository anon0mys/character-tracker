import React from "react";
import { ICharacterType, IAbilityType } from "../../Api";
import { cn } from "../../lib/utils";
import { signed } from "./format";

const abilities: { key: keyof ICharacterType; label: string }[] = [
  { key: "strength", label: "STR" },
  { key: "dexterity", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "wisdom", label: "WIS" },
  { key: "charisma", label: "CHA" },
];

const AbilitiesCard = ({ character }: { character: ICharacterType }) => {
  return (
    <div className="flex w-full flex-col gap-[9px] rounded-2xl border border-border bg-card p-[13px] lg:w-[272px] lg:flex-shrink-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Abilities &amp; saves
      </span>
      <div className="grid grid-cols-3 gap-[7px]">
        {abilities.map(({ key, label }) => {
          const ability = character[key] as IAbilityType;
          const proficient = character.proficiencies.includes(key as string);
          return (
            <div
              key={key}
              className={cn(
                "flex flex-col items-center gap-px rounded-[9px] border p-[9px_4px]",
                proficient
                  ? "border-border-strong bg-proficiency-soft"
                  : "border-hairline bg-secondary",
              )}
            >
              <span className="font-mono text-[9px] tracking-[0.08em] text-muted-foreground">
                {label}
              </span>
              <span className="font-mono text-[21px] font-semibold leading-tight">
                {ability.value}
              </span>
              <span className="font-mono text-[12px] text-foreground-2">
                {signed(ability.modifier)}
              </span>
              <span
                className={cn(
                  "font-mono text-[10px]",
                  proficient ? "text-proficiency-ink" : "text-muted-foreground",
                )}
              >
                sv {signed(ability.save)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-auto flex items-center gap-[7px] pt-1">
        <span className="h-[9px] w-[9px] rounded-[3px] bg-proficiency" />
        <span className="text-[11.5px] text-foreground-2">
          Brass marks a proficient save
        </span>
      </div>
    </div>
  );
};

export default AbilitiesCard;
