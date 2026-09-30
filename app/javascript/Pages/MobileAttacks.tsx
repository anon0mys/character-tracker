import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { IAttackType } from "../Api";
import { useCharacterData } from "../Hooks/useCharacterData";
import { useIsDesktop } from "../Hooks/useIsDesktop";
import { PinnedHp } from "../Components/Sheet";
import AttackForm from "../Components/Characters/AttackForm";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "../lib/utils";

const actionMeta = (a: IAttackType) => {
  const bits: string[] = [];
  if (a.action_type && a.action_type !== "action") bits.push(a.action_type);
  if (a.description) bits.push(a.description);
  return bits.join(" · ");
};

const AttackCard = ({
  attack,
  onEdit,
}: {
  attack: IAttackType;
  onEdit: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const riders = attack.riders ?? [];
  const hasBody = riders.length > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => (hasBody ? setOpen((v) => !v) : onEdit())}
        className="flex min-h-[60px] w-full items-center gap-[11px] px-[13px] py-[11px] text-left"
      >
        <span className="flex min-w-0 flex-grow flex-col gap-[2px]">
          <span className="text-[14.5px] font-semibold">
            {attack.name}
            {attack.extra_attack && (
              <span className="ml-2 rounded-full bg-harm-soft px-[6px] py-[2px] font-mono text-[9.5px] uppercase text-harm">
                ×2
              </span>
            )}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {actionMeta(attack)}
          </span>
        </span>
        <span className="flex w-[82px] flex-shrink-0 flex-col items-end gap-[1px]">
          <span className="font-mono text-[20px] font-semibold leading-none text-proficiency">
            {attack.bonus || "—"}
          </span>
          <span className="font-mono text-[11.5px] text-foreground-2">
            {attack.damage || "—"}
          </span>
        </span>
        {hasBody && (
          <ChevronDown
            className={cn(
              "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </button>
      {open && hasBody && (
        <div className="flex flex-col gap-[9px] border-t border-hairline px-[13px] py-[11px]">
          {riders.map((r, i) => (
            <div key={i} className="flex items-baseline gap-[9px]">
              <span className="w-[13px] flex-shrink-0 font-mono text-[11px] text-border-strong">
                ↳
              </span>
              <span className="flex min-w-0 flex-grow flex-col gap-[2px]">
                <span className="text-[12.5px] font-semibold">
                  {r.name}
                  {r.tag && (
                    <span className="ml-1 font-mono text-[9.5px] font-normal text-proficiency-ink">
                      {r.tag}
                    </span>
                  )}
                </span>
                {r.note && (
                  <span className="text-[11.5px] leading-snug text-foreground-2">
                    {r.note}
                  </span>
                )}
              </span>
              <span className="w-[62px] flex-shrink-0 text-right font-mono text-[11.5px] text-foreground-2">
                {r.damage}
              </span>
            </div>
          ))}
          <button
            type="button"
            onClick={onEdit}
            className="self-start text-[12px] text-primary"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

const MobileAttacks = () => {
  const { id } = useParams();
  const isDesktop = useIsDesktop();
  const { character, patch } = useCharacterData(id);
  const [attacks, setAttacks] = useState<IAttackType[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<IAttackType | undefined>();

  React.useEffect(() => {
    if (character.attacks) setAttacks(character.attacks);
  }, [character.attacks]);

  if (isDesktop) return <Navigate to={`/characters/${id}`} replace />;
  if (!character.id)
    return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  const close = (a: IAttackType | undefined) => {
    if (a) {
      setAttacks((prev) => {
        const exists = prev.some((x) => x.id === a.id);
        return exists ? prev.map((x) => (x.id === a.id ? a : x)) : [...prev, a];
      });
    }
    setFormOpen(false);
    setEditing(undefined);
  };

  return (
    <div className="-mx-4 -my-4 flex flex-col">
      <PinnedHp character={character} patch={patch} />
      <div className="flex items-center justify-between px-4 pb-2 pt-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Attacks
        </span>
        <button
          type="button"
          aria-label="Add attack"
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col gap-[7px] px-4 pb-4">
        {attacks.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-muted-foreground">
            No attacks yet.
          </p>
        ) : (
          attacks.map((a, i) => (
            <AttackCard
              key={a.id || i}
              attack={a}
              onEdit={() => {
                setEditing(a);
                setFormOpen(true);
              }}
            />
          ))
        )}
      </div>
      <AttackForm
        opened={formOpen}
        onClose={close}
        attack={editing}
        characterId={character.id}
      />
    </div>
  );
};

export default MobileAttacks;
