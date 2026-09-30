import React, { useState } from "react";
import { ICharacterType, ISpellListType, ISpellType } from "../../Api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from "../ui";
import { cn } from "../../lib/utils";
import { clamp } from "./format";
import SpellDetail from "./SpellDetail";
import GearTab from "./GearTab";
import ConsumablesTab from "./ConsumablesTab";

type Tab = "spells" | "gear" | "consumables";

interface RightPanelProps {
  character: ICharacterType;
  spellLists: ISpellListType[];
  currentSpellList?: ISpellListType;
  onSelectSpellList: (value: string) => void;
  onAddSpellList: () => void;
  patch: (
    updates: Partial<ICharacterType>,
    opts?: { debounce?: boolean },
  ) => void;
}

const NO_LIST = "none";

const levelBadge = (level: string) => {
  if (!level || level.toLowerCase() === "cantrip" || level === "0") return "C";
  return level;
};

const SlotRow = ({
  level,
  max,
  used,
  onSpend,
}: {
  level: number;
  max: number;
  used: number;
  onSpend: (used: number) => void;
}) => {
  const remaining = max - used;
  return (
    <div className="flex items-center gap-[9px]">
      <span className="w-[14px] font-mono text-[11px] text-muted-foreground">
        {level}
      </span>
      <div className="flex flex-grow flex-wrap gap-[5px]">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < remaining;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Level ${level} slot ${i + 1}`}
              onClick={() =>
                onSpend(clamp(filled ? used + 1 : used - 1, 0, max))
              }
              className={cn(
                "h-[24px] w-[24px] rounded-[7px] border",
                filled
                  ? "border-arcane bg-arcane"
                  : "border-border-strong bg-background",
              )}
            />
          );
        })}
      </div>
      <span className="font-mono text-[11px] text-muted-foreground">
        {remaining}/{max}
      </span>
    </div>
  );
};

const RightPanel = ({
  character,
  spellLists,
  currentSpellList,
  onSelectSpellList,
  onAddSpellList,
  patch,
}: RightPanelProps) => {
  const [tab, setTab] = useState<Tab>("spells");
  const [selectedSpell, setSelectedSpell] = useState<ISpellType | null>(null);

  const tabs: { key: Tab; label: string }[] = [
    { key: "spells", label: "Spells" },
    { key: "gear", label: "Gear" },
    { key: "consumables", label: "Consumables" },
  ];

  const spells = currentSpellList?.spells ?? [];
  const slotsMax = character.spell_slots_max ?? [];
  const slotsUsed = character.spell_slots_used ?? {};

  const spend = (level: number, used: number) =>
    patch(
      { spell_slots_used: { ...slotsUsed, [String(level)]: used } },
      { debounce: false },
    );

  return (
    <div className="flex min-h-0 w-full flex-col gap-3 rounded-2xl border border-border bg-card p-[14px] lg:w-[430px] lg:flex-shrink-0">
      {!selectedSpell && (
        <div className="flex flex-shrink-0 rounded-[9px] bg-rail p-[3px]">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={cn(
                "flex-grow rounded-[7px] py-[10px] text-center text-[13px]",
                tab === key
                  ? "bg-card font-semibold text-foreground"
                  : "text-foreground-2",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {tab === "spells" &&
        (selectedSpell ? (
          <SpellDetail
            spell={selectedSpell}
            onBack={() => setSelectedSpell(null)}
          />
        ) : (
          <>
            {slotsMax.length > 0 && (
              <div className="flex flex-shrink-0 flex-col gap-[6px] border-b border-hairline pb-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  Slots
                </span>
                {slotsMax.map((max, idx) =>
                  max > 0 ? (
                    <SlotRow
                      key={idx}
                      level={idx + 1}
                      max={max}
                      used={slotsUsed[String(idx + 1)] ?? 0}
                      onSpend={(u) => spend(idx + 1, u)}
                    />
                  ) : null,
                )}
              </div>
            )}

            <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
              <Select
                value={currentSpellList?.id?.toString() ?? NO_LIST}
                onValueChange={onSelectSpellList}
              >
                <SelectTrigger className="min-h-[40px] flex-grow">
                  <SelectValue placeholder="Switch list" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_LIST}>No list</SelectItem>
                  {spellLists.map((list) => (
                    <SelectItem key={list.id} value={String(list.id)}>
                      {list.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="min-h-[40px]"
                onClick={onAddSpellList}
              >
                New list
              </Button>
            </div>

            {spells.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-muted-foreground">
                {currentSpellList
                  ? "This list has no spells."
                  : "No spell list selected."}
              </p>
            ) : (
              <div className="flex min-h-0 flex-grow flex-col gap-[3px] overflow-y-auto pr-1">
                {spells.map((spell) => (
                  <button
                    key={spell.id}
                    type="button"
                    onClick={() => setSelectedSpell(spell)}
                    className="flex items-center gap-[9px] rounded-lg px-2 py-2 text-left hover:bg-secondary"
                  >
                    <span className="flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md bg-arcane-soft font-mono text-[10px] text-arcane-ink">
                      {levelBadge(spell.level)}
                    </span>
                    <span className="min-w-0 flex-grow truncate text-[13px]">
                      {spell.name}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {spell.school}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </>
        ))}

      {tab === "gear" && <GearTab character={character} patch={patch} />}
      {tab === "consumables" && <ConsumablesTab characterId={character.id!} />}
    </div>
  );
};

export default RightPanel;
