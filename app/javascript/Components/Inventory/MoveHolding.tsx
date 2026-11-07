import React, { useEffect, useState } from "react";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import {
  Client,
  HolderType,
  ICharacterType,
  IHoldingType,
  ILocationType,
  INpcType,
} from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { cn } from "../../lib/utils";
import { isContainer, isGone } from "./holdings";

interface MoveHoldingProps {
  gameId: number;
  holding: IHoldingType;
  holdings: IHoldingType[];
  onBack: () => void;
  onMoved: () => void;
}

interface Destination {
  key: string;
  type: HolderType;
  id: number;
  label: string;
  hint?: string;
}

/** Containers: anything already holding things, or a bag. Never itself. */
const containers = (holdings: IHoldingType[], moving: IHoldingType) =>
  holdings.filter(
    (h) =>
      h.id !== moving.id &&
      !isGone(h) &&
      (isContainer(holdings, h) || (h.item.tags ?? []).includes("bag")),
  );

const MoveHolding = ({
  gameId,
  holding,
  holdings,
  onBack,
  onMoved,
}: MoveHoldingProps) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const token = auth.getToken();
  const [party, setParty] = useState<ICharacterType[]>([]);
  const [npcs, setNpcs] = useState<INpcType[]>([]);
  const [places, setPlaces] = useState<ILocationType[]>([]);
  const [count, setCount] = useState(Math.min(1, holding.quantity));
  const [picked, setPicked] = useState<Destination | null>(null);

  useEffect(() => {
    client
      .get({ path: `/characters?game_id=${gameId}`, token })
      .then((r) => setParty(r.data ?? []))
      .catch((e) => errors.setError(e));
    client
      .get({ path: `/games/${gameId}/npcs`, token })
      .then((r) => setNpcs(r.data ?? []))
      .catch((e) => errors.setError(e));
    client
      .get({ path: `/games/${gameId}/locations`, token })
      .then((r) => setPlaces(r.data ?? []))
      .catch((e) => errors.setError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const here = (type: HolderType, id: number) =>
    holding.holder_type === type && holding.holder_id === id;

  const groups: { title: string; options: Destination[] }[] = [
    {
      title: "Party",
      options: party.map((c) => ({
        key: `Character-${c.id}`,
        type: "Character",
        id: Number(c.id),
        label: c.name,
      })),
    },
    {
      title: "Places & containers",
      options: [
        ...places.map((p) => ({
          key: `Location-${p.id}`,
          type: "Location" as HolderType,
          id: p.id,
          label: p.name,
        })),
        ...containers(holdings, holding).map((h) => ({
          key: `Holding-${h.id}`,
          type: "Holding" as HolderType,
          id: h.id,
          label: h.item.name,
          hint: h.holder_name ? `${h.holder_name}'s` : undefined,
        })),
      ],
    },
    {
      title: "NPCs",
      options: npcs.map((n) => ({
        key: `Npc-${n.id}`,
        type: "Npc",
        id: n.id,
        label: n.name,
      })),
    },
  ];

  const move = () => {
    if (!picked) return;
    client
      .patch({
        path: `/games/${gameId}/holdings/${holding.id}`,
        payload: {
          holder_type: picked.type,
          holder_id: picked.id,
          move_quantity: holding.quantity > 1 ? count : undefined,
        },
        token,
        successMessage: `Moved to ${picked.label}`,
      })
      .then(onMoved)
      .catch((e) => errors.setError(e));
  };

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3">
      <div className="flex flex-shrink-0 items-center gap-[9px]">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] border border-border bg-secondary text-foreground-2"
        >
          <ChevronLeft className="h-[17px] w-[17px]" />
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Move
        </span>
      </div>

      <div className="flex flex-shrink-0 flex-col gap-[3px]">
        <h2 className="font-display text-[24px] font-semibold leading-[1.1]">
          {holding.item.name}
        </h2>
        <span className="font-mono text-[11px] text-muted-foreground">
          now: {holding.holder_name ?? "not placed"} · ×{holding.quantity}
        </span>
      </div>

      {holding.quantity > 1 && (
        <div className="flex flex-shrink-0 items-center gap-[10px] rounded-[10px] bg-secondary px-3 py-2">
          <span className="flex-grow text-[13px] text-foreground-2">
            How many
          </span>
          <button
            type="button"
            aria-label="One fewer"
            disabled={count <= 1}
            onClick={() => setCount(count - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-border bg-card disabled:opacity-40 lg:h-8 lg:w-8"
          >
            <Minus className="h-[14px] w-[14px]" />
          </button>
          <span className="min-w-[50px] text-center font-mono text-[15px] font-semibold">
            {count} / {holding.quantity}
          </span>
          <button
            type="button"
            aria-label="One more"
            disabled={count >= holding.quantity}
            onClick={() => setCount(count + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-border bg-card disabled:opacity-40 lg:h-8 lg:w-8"
          >
            <Plus className="h-[14px] w-[14px]" />
          </button>
        </div>
      )}

      <fieldset className="m-0 flex min-h-0 flex-grow flex-col gap-[2px] overflow-y-auto border-0 p-0 pr-1">
        <legend className="sr-only">Move to</legend>
        {groups.map(
          (group) =>
            group.options.length > 0 && (
              <React.Fragment key={group.title}>
                <span className="px-[2px] pb-[5px] pt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                  {group.title}
                </span>
                {group.options.map((d) => (
                  <label
                    key={d.key}
                    className={cn(
                      "flex min-h-[44px] cursor-pointer items-center gap-[10px] rounded-[9px] px-[10px] py-1 text-[13.5px]",
                      picked?.key === d.key &&
                        "bg-arcane-soft font-semibold text-arcane-ink",
                      here(d.type, d.id) && "cursor-default opacity-50",
                    )}
                  >
                    <input
                      type="radio"
                      name="move-destination"
                      disabled={here(d.type, d.id)}
                      checked={picked?.key === d.key}
                      onChange={() => setPicked(d)}
                      className="accent-arcane"
                    />
                    {d.hint ? `${d.hint} ${d.label}` : d.label}
                    {here(d.type, d.id) && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        here now
                      </span>
                    )}
                  </label>
                ))}
              </React.Fragment>
            ),
        )}
      </fieldset>

      <div className="flex-shrink-0 border-t border-hairline pt-3">
        <button
          type="button"
          disabled={!picked}
          onClick={move}
          className="min-h-[46px] w-full rounded-[10px] bg-arcane text-[14px] font-semibold text-primary-foreground disabled:opacity-50"
        >
          {picked
            ? `Move ${holding.quantity > 1 ? count : ""} to ${picked.label}`.replace(
                "  ",
                " ",
              )
            : "Pick where it goes"}
        </button>
      </div>
    </div>
  );
};

export default MoveHolding;
