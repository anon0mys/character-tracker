import React from "react";
import { ICharacterType, IAbilityType } from "../../Api";
import { cn } from "../../lib/utils";
import { signed } from "./format";

// Phase 2 placeholder: the skills slot shows the six saving throws.
// The full two-column skills list arrives in Phase 4d.
const saves: { key: keyof ICharacterType; label: string }[] = [
  { key: "strength", label: "Strength" },
  { key: "dexterity", label: "Dexterity" },
  { key: "constitution", label: "Constitution" },
  { key: "intelligence", label: "Intelligence" },
  { key: "wisdom", label: "Wisdom" },
  { key: "charisma", label: "Charisma" },
];

const SkillsCard = ({ character }: { character: ICharacterType }) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-[13px] lg:w-[372px] lg:flex-shrink-0">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Saving throws
      </span>
      <div className="flex flex-col">
        {saves.map(({ key, label }) => {
          const ability = character[key] as IAbilityType;
          const proficient = character.proficiencies.includes(key as string);
          return (
            <div
              key={key}
              className={cn(
                "flex items-center gap-[6px] rounded-[5px] px-[5px] py-[3px]",
                proficient && "bg-proficiency-soft",
              )}
            >
              <span
                className={cn(
                  "h-[6px] w-[6px] flex-shrink-0 rounded-full",
                  proficient ? "bg-proficiency" : "bg-border-strong",
                )}
              />
              <span
                className={cn(
                  "min-w-0 flex-grow text-[11.5px]",
                  proficient ? "font-semibold" : "text-foreground-2",
                )}
              >
                {label}
              </span>
              <span
                className={cn(
                  "font-mono text-[11.5px]",
                  proficient && "text-proficiency-ink",
                )}
              >
                {signed(ability.save)}
              </span>
            </div>
          );
        })}
      </div>
      <span className="mt-auto pt-1 text-[11px] text-muted-foreground">
        Skills arrive in a later phase.
      </span>
    </div>
  );
};

export default SkillsCard;
