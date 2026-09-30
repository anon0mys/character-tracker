import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Client, ISpellListType, ISpellType, ICharacterType } from "../Api";
import { useAuth } from "../Auth";
import { useError } from "../Errors";
import { useCharacterData } from "../Hooks/useCharacterData";
import { useIsDesktop } from "../Hooks/useIsDesktop";
import { PinnedHp, SpellDetail } from "../Components/Sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Components/ui";
import { clamp } from "../Components/Sheet/format";
import { cn } from "../lib/utils";

const NO_LIST = "none";
const levelBadge = (l: string) =>
  !l || l.toLowerCase() === "cantrip" || l === "0" ? "C" : l;

const MobileSpells = () => {
  const { id } = useParams();
  const isDesktop = useIsDesktop();
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const { character, patch } = useCharacterData(id);
  const [spellLists, setSpellLists] = useState<ISpellListType[]>([]);
  const [currentList, setCurrentList] = useState<ISpellListType | undefined>();
  const [selected, setSelected] = useState<ISpellType | null>(null);

  useEffect(() => {
    if (character.current_spell_list)
      setCurrentList(character.current_spell_list);
  }, [character.current_spell_list]);
  useEffect(() => {
    if (!id) return;
    client
      .get({ path: `/characters/${id}/spell_lists`, token: auth.getToken() })
      .then((r) => setSpellLists(r.data ?? []))
      .catch((e) => errors.setError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isDesktop) return <Navigate to={`/characters/${id}`} replace />;
  if (!character.id)
    return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  const slotsMax = character.spell_slots_max ?? [];
  const slotsUsed = character.spell_slots_used ?? {};
  const spend = (level: number, used: number) =>
    patch(
      { spell_slots_used: { ...slotsUsed, [String(level)]: used } },
      { debounce: false },
    );

  const selectList = (value: string) => {
    const nextId = value === NO_LIST ? null : Number(value);
    const next =
      value === NO_LIST
        ? undefined
        : spellLists.find((l) => String(l.id) === value);
    client
      .patch({
        path: `/characters/${id}`,
        payload: { character: { current_spell_list_id: nextId } },
        token: auth.getToken(),
        showSuccessToast: false,
      })
      .then(() => setCurrentList(next))
      .catch((e) => errors.setError(e));
  };

  if (selected) {
    return (
      <div className="-mx-4 -my-4 flex min-h-[70vh] flex-col p-4">
        <SpellDetail spell={selected} onBack={() => setSelected(null)} />
      </div>
    );
  }

  const spells = currentList?.spells ?? [];

  return (
    <div className="-mx-4 -my-4 flex flex-col">
      <PinnedHp character={character as ICharacterType} patch={patch} />

      {slotsMax.length > 0 && (
        <div className="flex flex-col gap-[7px] border-b border-border bg-card px-[14px] py-3">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
            Slots
          </span>
          {slotsMax.map((max, idx) =>
            max > 0 ? (
              <div key={idx} className="flex items-center gap-[9px]">
                <span className="w-[12px] font-mono text-[11px] text-muted-foreground">
                  {idx + 1}
                </span>
                <div className="flex flex-grow flex-wrap gap-[6px]">
                  {Array.from({ length: max }).map((_, i) => {
                    const remaining = max - (slotsUsed[String(idx + 1)] ?? 0);
                    const filled = i < remaining;
                    const used = slotsUsed[String(idx + 1)] ?? 0;
                    return (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Level ${idx + 1} slot ${i + 1}`}
                        onClick={() =>
                          spend(
                            idx + 1,
                            clamp(filled ? used + 1 : used - 1, 0, max),
                          )
                        }
                        className={cn(
                          "h-[32px] w-[32px] rounded-lg border",
                          filled
                            ? "border-arcane bg-arcane"
                            : "border-border-strong bg-background",
                        )}
                      />
                    );
                  })}
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  {max - (slotsUsed[String(idx + 1)] ?? 0)}/{max}
                </span>
              </div>
            ) : null,
          )}
        </div>
      )}

      <div className="px-4 py-3">
        <Select
          value={currentList?.id?.toString() ?? NO_LIST}
          onValueChange={selectList}
        >
          <SelectTrigger className="min-h-[40px]">
            <SelectValue placeholder="Switch list" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NO_LIST}>No list</SelectItem>
            {spellLists.map((l) => (
              <SelectItem key={l.id} value={String(l.id)}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-[6px] px-4 pb-4">
        {spells.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-muted-foreground">
            {currentList
              ? "This list has no spells."
              : "No spell list selected."}
          </p>
        ) : (
          spells.map((spell) => (
            <button
              key={spell.id}
              type="button"
              onClick={() => setSelected(spell)}
              className="flex min-h-[56px] items-center gap-[11px] rounded-xl border border-border bg-card px-3 py-[10px] text-left"
            >
              <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-arcane font-mono text-[12px] text-primary-foreground">
                {levelBadge(spell.level)}
              </span>
              <span className="flex min-w-0 flex-grow flex-col gap-[1px]">
                <span className="text-[14px] font-semibold">{spell.name}</span>
                <span className="font-mono text-[10.5px] text-muted-foreground">
                  {spell.school} · {spell.range}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileSpells;
