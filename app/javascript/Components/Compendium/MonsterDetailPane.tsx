import React from "react";
import { MentionedInJournal } from "../Journal";
import { IMonsterType, IMonsterAction } from "../../Api";
import { X } from "lucide-react";

const mod = (score?: number) => {
  if (score == null) return "";
  const m = Math.floor((score - 10) / 2);
  return m >= 0 ? `+${m}` : `${m}`;
};

const speedText = (speed: unknown) => {
  if (!speed) return "";
  if (typeof speed === "string") return speed;
  if (typeof speed === "object") {
    return Object.entries(speed as Record<string, unknown>)
      .map(([k, v]) => `${k} ${v}`)
      .join(", ");
  }
  return "";
};

const Section = ({
  title,
  items,
}: {
  title: string;
  items?: IMonsterAction[];
}) =>
  items && items.length > 0 ? (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-proficiency-ink">
        {title}
      </span>
      {items.map((a, i) => (
        <p key={i} className="text-[13px] leading-relaxed">
          <span className="font-semibold">{a.name}.</span> {a.desc}
        </p>
      ))}
    </div>
  ) : null;

const ABIL: [keyof IMonsterType, string][] = [
  ["strength", "STR"],
  ["dexterity", "DEX"],
  ["constitution", "CON"],
  ["intelligence", "INT"],
  ["wisdom", "WIS"],
  ["charisma", "CHA"],
];

const MonsterDetailPane = ({
  monster,
  onClose,
}: {
  monster: IMonsterType;
  onClose: () => void;
}) => {
  const sb = monster.stat_block ?? {};
  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-[3px]">
          <h2 className="font-display text-[26px] font-semibold leading-tight">
            {monster.name}
          </h2>
          <span className="text-[13px] italic text-foreground-2">
            {monster.size} {monster.creature_type}
            {monster.subtype ? ` (${monster.subtype})` : ""} ·{" "}
            {monster.alignment}
          </span>
        </div>
        <button
          type="button"
          aria-label="Close detail"
          onClick={onClose}
          className="ml-auto flex h-9 w-9 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-secondary"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-[10px]">
        {[
          ["Armor class", monster.armor_class],
          ["Hit points", monster.hit_points],
          ["CR", monster.challenge_rating],
        ].map(([label, val]) => (
          <div
            key={label as string}
            className="flex flex-col gap-[2px] rounded-[10px] bg-secondary p-[11px_13px]"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              {label}
            </span>
            <span className="font-mono text-[18px] font-semibold">{val}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-6 gap-[6px]">
        {ABIL.map(([key, label]) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-[8px] bg-secondary p-[8px_2px]"
          >
            <span className="font-mono text-[9px] text-muted-foreground">
              {label}
            </span>
            <span className="font-mono text-[15px] font-semibold">
              {monster[key] as number}
            </span>
            <span className="font-mono text-[11px] text-foreground-2">
              {mod(monster[key] as number)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1 text-[12.5px] text-foreground-2">
        {speedText(sb.speed) && (
          <span>
            <span className="font-semibold">Speed:</span> {speedText(sb.speed)}
          </span>
        )}
        {typeof sb.senses === "string" && sb.senses && (
          <span>
            <span className="font-semibold">Senses:</span> {sb.senses}
          </span>
        )}
        {typeof sb.languages === "string" && sb.languages && (
          <span>
            <span className="font-semibold">Languages:</span> {sb.languages}
          </span>
        )}
      </div>

      {monster.description && (
        <p className="whitespace-pre-line text-[13px] leading-relaxed">
          {monster.description}
        </p>
      )}

      <Section title="Traits" items={sb.special_abilities} />
      <Section title="Actions" items={sb.actions} />
      <Section title="Reactions" items={sb.reactions} />
      <Section title="Legendary actions" items={sb.legendary_actions} />
      <MentionedInJournal type="Monster" id={monster.id} />

      {monster.source && (
        <span className="mt-auto text-[11px] text-muted-foreground">
          Source: {monster.source}
        </span>
      )}
    </div>
  );
};

export default MonsterDetailPane;
