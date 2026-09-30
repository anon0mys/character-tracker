import React from "react";
import { ICharacterType, ISkill } from "../../Api";
import { cn } from "../../lib/utils";
import { signed } from "./format";

interface SkillsCardProps {
  character: ICharacterType;
  patch: (
    updates: Partial<ICharacterType>,
    opts?: { debounce?: boolean },
  ) => void;
}

const SkillRow = ({ skill }: { skill: ISkill }) => (
  <div
    className={cn(
      "flex items-center gap-[6px] rounded-[5px] px-[5px] py-[3px]",
      skill.proficient && "bg-proficiency-soft",
    )}
  >
    <span
      className={cn(
        "h-[6px] w-[6px] flex-shrink-0 rounded-full",
        skill.proficient ? "bg-proficiency" : "bg-border-strong",
      )}
    />
    <span
      className={cn(
        "min-w-0 flex-grow truncate text-[11.5px]",
        skill.proficient ? "font-semibold" : "text-foreground-2",
      )}
    >
      {skill.name}
      {skill.expertise && (
        <span className="ml-1 text-[9.5px] font-normal text-muted-foreground">
          exp
        </span>
      )}
    </span>
    <span
      className={cn(
        "font-mono text-[11.5px]",
        skill.proficient && "text-proficiency-ink",
      )}
    >
      {signed(skill.modifier)}
    </span>
  </div>
);

const SkillsCard = ({ character, patch }: SkillsCardProps) => {
  const skills = character.skills ?? [];
  const mid = Math.ceil(skills.length / 2);
  const left = skills.slice(0, mid);
  const right = skills.slice(mid);

  const addCustom = () => {
    const name = window.prompt("Custom skill name (e.g. Alchemy)");
    if (!name || !name.trim()) return;
    const ability = (
      window.prompt(
        "Ability (strength/dexterity/…/intelligence)",
        "intelligence",
      ) || "intelligence"
    ).trim();
    const next = [
      ...(character.custom_skills ?? []),
      { name: name.trim(), ability, proficient: true, expertise: false },
    ];
    patch({ custom_skills: next }, { debounce: false });
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-card p-[13px] lg:w-[372px] lg:flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Skills
        </span>
        <button
          type="button"
          onClick={addCustom}
          className="ml-auto min-h-[30px] rounded-full border border-dashed border-border-strong px-[10px] text-[11px] text-foreground-2"
        >
          Add custom
        </button>
      </div>
      <div className="flex gap-[9px]">
        <div className="flex min-w-0 flex-grow flex-col">
          {left.map((s) => (
            <SkillRow key={s.name} skill={s} />
          ))}
        </div>
        <div className="flex min-w-0 flex-grow flex-col">
          {right.map((s) => (
            <SkillRow key={s.name} skill={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsCard;
