import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, MessageSquare } from "lucide-react";
import { ICharacterType, IHoldingType } from "../../Api";
import { cn } from "../../lib/utils";
import {
  AddHolding,
  HoldingDetail,
  MoveHolding,
  contentsOf,
  heldBy,
  holdingMeta,
  isGone,
  useCampaignHoldings,
} from "../Inventory";
import { ReadOnlyFieldset } from "./SheetAccess";

interface GearTabProps {
  character: ICharacterType;
  patch: (
    updates: Partial<ICharacterType>,
    opts?: { debounce?: boolean },
  ) => void;
  /** True while a holding's detail or move screen has taken over the panel. */
  onTakeoverChange?: (active: boolean) => void;
}

type View =
  | { mode: "list" }
  | { mode: "detail"; id: number }
  | { mode: "move"; holding: IHoldingType };

const COINS: { field: keyof ICharacterType; label: string }[] = [
  { field: "copper", label: "C" },
  { field: "silver", label: "S" },
  { field: "electrum", label: "E" },
  { field: "gold", label: "G" },
  { field: "platinum", label: "P" },
];

const SectionHeading = ({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children?: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 px-[2px] pb-[6px] pt-1">
    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
      {title}
    </span>
    <span className="rounded-full bg-secondary px-2 py-[1px] font-mono text-[11px] text-foreground-2">
      {count}
    </span>
    {children}
  </div>
);

const HoldingRow = ({
  holding,
  emphasis,
  onOpen,
}: {
  holding: IHoldingType;
  emphasis?: boolean;
  onOpen: () => void;
}) => {
  const meta = holdingMeta(holding);
  const empty = holding.quantity === 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "flex min-h-[44px] w-full items-center gap-[10px] rounded-[9px] px-[10px] py-[8px] text-left hover:bg-secondary",
        emphasis && "bg-proficiency-soft hover:bg-proficiency-soft",
      )}
    >
      {emphasis && (
        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-proficiency" />
      )}
      <span className="flex min-w-0 flex-grow flex-col gap-[1px]">
        <span
          className={cn(
            "truncate text-[13.5px]",
            emphasis && "font-semibold",
            empty && "text-muted-foreground",
          )}
        >
          {holding.item.name}
        </span>
        {meta && (
          <span className="truncate font-mono text-[10px] text-muted-foreground">
            {meta}
          </span>
        )}
      </span>
      {holding.notes && (
        <MessageSquare
          aria-label="Has table notes"
          className="h-[14px] w-[14px] flex-shrink-0 text-muted-foreground"
        />
      )}
      <span className="flex-shrink-0 font-mono text-[11px] text-muted-foreground">
        {empty
          ? "none left"
          : holding.item.total_charges
            ? `${holding.item.total_charges} ch`
            : holding.quantity > 1
              ? `×${holding.quantity}`
              : ""}
      </span>
    </button>
  );
};

const GearTab = ({ character, patch, onTakeoverChange }: GearTabProps) => {
  const { holdings, loading, reload } = useCampaignHoldings(character.game_id);
  const [view, setView] = useState<View>({ mode: "list" });
  const [collapsed, setCollapsed] = useState<number[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    onTakeoverChange?.(view.mode !== "list");
  }, [view.mode]); // eslint-disable-line react-hooks/exhaustive-deps

  const gameId = character.game_id!;
  const mine = heldBy(holdings, "Character", Number(character.id)).filter(
    (h) => !isGone(h),
  );
  const equipped = mine.filter((h) => h.status === "equipped");
  const carried = mine.filter((h) => h.status !== "equipped");
  const open = (h: IHoldingType) => setView({ mode: "detail", id: h.id });

  if (view.mode === "detail")
    return (
      <HoldingDetail
        gameId={gameId}
        holdingId={view.id}
        onBack={() => setView({ mode: "list" })}
        onMove={(h) => setView({ mode: "move", holding: h })}
        onChanged={reload}
      />
    );

  if (view.mode === "move")
    return (
      <MoveHolding
        gameId={gameId}
        holding={view.holding}
        holdings={holdings}
        onBack={() => setView({ mode: "detail", id: view.holding.id })}
        onMoved={() => {
          reload();
          setView({ mode: "list" });
        }}
      />
    );

  const toggle = (id: number) =>
    setCollapsed((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id],
    );

  const renderCarried = (h: IHoldingType) => {
    const inside = contentsOf(holdings, h).filter((c) => !isGone(c));
    if (inside.length === 0)
      return <HoldingRow key={h.id} holding={h} onOpen={() => open(h)} />;
    const expanded = !collapsed.includes(h.id);
    return (
      <div
        key={h.id}
        className="mt-1 flex flex-col rounded-[10px] border border-border bg-secondary/50"
      >
        <div className="flex items-center">
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={
              expanded ? `Close ${h.item.name}` : `Open ${h.item.name}`
            }
            onClick={() => toggle(h.id)}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center text-foreground-2"
          >
            {expanded ? (
              <ChevronDown className="h-[14px] w-[14px]" />
            ) : (
              <ChevronRight className="h-[14px] w-[14px]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => open(h)}
            className="flex min-h-[44px] flex-grow items-center gap-2 pr-[10px] text-left"
          >
            <span className="flex-grow text-[13.5px] font-semibold">
              {h.item.name}
            </span>
            <span className="rounded-full bg-background px-2 py-[2px] font-mono text-[11px] text-foreground-2">
              {inside.length} inside
            </span>
          </button>
        </div>
        {expanded && (
          <div className="flex flex-col gap-[1px] pb-2 pl-[30px] pr-2">
            {inside.map((c) => (
              <div key={c.id} className="border-l border-border">
                <HoldingRow holding={c} onOpen={() => open(c)} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3">
      <div className="flex min-h-0 flex-grow flex-col gap-[3px] overflow-y-auto pr-1">
        {loading ? (
          <p className="py-6 text-center text-[13px] text-muted-foreground">
            Loading gear…
          </p>
        ) : (
          <>
            <SectionHeading title="Equipped" count={equipped.length} />
            {equipped.length === 0 && (
              <p className="px-[10px] pb-2 text-[12.5px] text-muted-foreground">
                Nothing equipped. Open an item to equip it.
              </p>
            )}
            {equipped.map((h) => (
              <HoldingRow
                key={h.id}
                holding={h}
                emphasis
                onOpen={() => open(h)}
              />
            ))}

            <div className="mx-[10px] my-[7px] h-px bg-hairline" />

            <SectionHeading title="Carried" count={carried.length}>
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="ml-auto min-h-[30px] rounded-full border border-border-strong px-[11px] py-1 text-[11px] text-foreground-2"
              >
                Add item
              </button>
            </SectionHeading>
            {carried.length === 0 && (
              <p className="px-[10px] text-[12.5px] text-muted-foreground">
                No gear carried.
              </p>
            )}
            {carried.map(renderCarried)}
          </>
        )}
      </div>

      <ReadOnlyFieldset>
        <div className="flex flex-shrink-0 items-center gap-[6px] border-t border-hairline pt-[11px]">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Coin
          </span>
          {COINS.map(({ field, label }) => (
            <label
              key={field}
              className="flex flex-grow items-center gap-1 rounded-md bg-secondary px-[6px]"
            >
              <span className="font-mono text-[11px] text-proficiency-ink">
                {label}
              </span>
              <input
                inputMode="numeric"
                aria-label={`${field} pieces`}
                value={(character[field] as number) ?? 0}
                onChange={(e) =>
                  patch({
                    [field]: Math.max(0, parseInt(e.target.value || "0", 10)),
                  } as Partial<ICharacterType>)
                }
                className="h-8 w-full min-w-0 bg-transparent text-center font-mono text-[11px]"
              />
            </label>
          ))}
        </div>
      </ReadOnlyFieldset>

      <AddHolding
        open={adding}
        onClose={() => setAdding(false)}
        gameId={gameId}
        holder={{
          type: "Character",
          id: Number(character.id),
          name: character.name,
        }}
        onAdded={reload}
      />
    </div>
  );
};

export default GearTab;
