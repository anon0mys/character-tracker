import React, { useEffect, useState } from "react";
import { Client, INpcType, archetypes } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { cn } from "../../lib/utils";
import { initials } from "../Shell";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui";
import AddHolding from "./AddHolding";
import HoldingDetail from "./HoldingDetail";
import MoveHolding from "./MoveHolding";
import { STATUS_CHIP, heldBy, isGone } from "./holdings";
import { useCampaignHoldings } from "./useCampaignHoldings";

const NO_CLASS = "none";
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const NpcForm = ({
  npc,
  open,
  onClose,
  onSave,
}: {
  npc: Partial<INpcType> | null;
  open: boolean;
  onClose: () => void;
  onSave: (attrs: Partial<INpcType>) => void;
}) => {
  const [draft, setDraft] = useState<Partial<INpcType>>(npc ?? {});
  useEffect(() => setDraft(npc ?? {}), [npc]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="font-display">
            {npc?.id ? `Edit ${npc.name}` : "Add an NPC"}
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
          }}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="npc-name">Name</Label>
            <Input
              id="npc-name"
              value={draft.name ?? ""}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="npc-class">Class</Label>
              <Select
                value={draft.archetype ?? NO_CLASS}
                onValueChange={(v) =>
                  setDraft({ ...draft, archetype: v === NO_CLASS ? null : v })
                }
              >
                <SelectTrigger id="npc-class">
                  <SelectValue placeholder="No class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CLASS}>No class</SelectItem>
                  {archetypes.map((a) => (
                    <SelectItem key={a} value={a}>
                      {capitalize(a)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="npc-race">Race</Label>
              <Input
                id="npc-race"
                value={draft.race ?? ""}
                onChange={(e) => setDraft({ ...draft, race: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="npc-description">Description</Label>
            <Input
              id="npc-description"
              value={draft.description ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!draft.name}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type Panel =
  | { mode: "npc" }
  | { mode: "detail"; id: number }
  | { mode: "move"; holdingId: number };

const NpcsSection = ({ gameId }: { gameId: number }) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const token = auth.getToken();
  const { holdings, reload } = useCampaignHoldings(gameId);
  const [npcs, setNpcs] = useState<INpcType[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Partial<INpcType> | null>(null);
  const [giving, setGiving] = useState(false);
  const [panel, setPanel] = useState<Panel>({ mode: "npc" });

  const loadNpcs = () =>
    client
      .get({ path: `/games/${gameId}/npcs`, token })
      .then((r) => {
        setNpcs(r.data ?? []);
        setSelectedId((id) => id ?? r.data?.[0]?.id ?? null);
      })
      .catch((e) => errors.setError(e));

  useEffect(() => {
    loadNpcs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const save = (attrs: Partial<INpcType>) => {
    const payload = {
      npc: {
        name: attrs.name,
        description: attrs.description,
        race: attrs.race,
        archetype: attrs.archetype,
      },
    };
    const request = attrs.id
      ? client.patch({
          path: `/games/${gameId}/npcs/${attrs.id}`,
          payload,
          token,
        })
      : client.post({ path: `/games/${gameId}/npcs`, payload, token });
    request
      .then((r) => {
        setEditing(null);
        setSelectedId(r.data.id);
        loadNpcs();
      })
      .catch((e) => errors.setError(e));
  };

  const needle = query.trim().toLowerCase();
  const visible = npcs.filter(
    (n) => !needle || n.name.toLowerCase().includes(needle),
  );
  const npc = npcs.find((n) => n.id === selectedId) ?? null;
  const carrying = npc
    ? heldBy(holdings, "Npc", npc.id).filter((h) => !isGone(h))
    : [];
  const moving =
    panel.mode === "move"
      ? holdings.find((h) => h.id === panel.holdingId)
      : undefined;

  return (
    <div className="flex min-h-0 flex-col gap-[18px] lg:flex-row">
      <section
        aria-label="NPCs in this campaign"
        className={cn(
          "w-full flex-shrink-0 flex-col gap-[10px] self-start rounded-[14px] border border-border bg-card p-3 lg:flex lg:w-[360px]",
          npc ? "hidden" : "flex",
        )}
      >
        <div className="flex items-center gap-2">
          <label htmlFor="npc-q" className="sr-only">
            Search NPCs
          </label>
          <input
            id="npc-q"
            type="search"
            placeholder="Search NPCs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-11 min-w-0 flex-grow rounded-[10px] border border-border bg-background px-[13px] text-[14px]"
          />
          <button
            type="button"
            onClick={() => setEditing({})}
            className="min-h-11 rounded-[10px] bg-primary px-[14px] text-[14px] font-semibold text-primary-foreground"
          >
            Add NPC
          </button>
        </div>
        {visible.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => {
              setSelectedId(n.id);
              setPanel({ mode: "npc" });
            }}
            className={cn(
              "flex min-h-[52px] items-center gap-[10px] rounded-[9px] px-[10px] py-2 text-left",
              n.id === selectedId && "bg-proficiency-soft",
            )}
          >
            <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[10px] text-foreground-2">
              {initials(n.name)}
            </span>
            <span className="flex flex-grow flex-col gap-[1px]">
              <span className="text-[14px] font-semibold">{n.name}</span>
              {n.archetype && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  {capitalize(n.archetype)}
                </span>
              )}
            </span>
            <span className="font-mono text-[12px] text-foreground-2">
              {n.holding_count}
            </span>
          </button>
        ))}
        {npcs.length === 0 && (
          <p className="py-6 text-center text-[13px] text-muted-foreground">
            No NPCs yet.
          </p>
        )}
      </section>

      {npc && (
        <section
          aria-labelledby="npc-h"
          className="flex min-h-[560px] min-w-0 flex-grow flex-col gap-4 rounded-[14px] border border-border-strong bg-card p-[18px] lg:px-[22px] lg:py-5"
        >
          {panel.mode === "detail" && (
            <HoldingDetail
              gameId={gameId}
              holdingId={panel.id}
              onBack={() => setPanel({ mode: "npc" })}
              onMove={(h) => setPanel({ mode: "move", holdingId: h.id })}
              onChanged={reload}
              backLabel={`Back to ${npc.name}`}
            />
          )}
          {panel.mode === "move" && moving && (
            <MoveHolding
              gameId={gameId}
              holding={moving}
              holdings={holdings}
              onBack={() => setPanel({ mode: "detail", id: moving.id })}
              onMoved={() => {
                reload();
                loadNpcs();
                setPanel({ mode: "npc" });
              }}
            />
          )}
          {panel.mode === "npc" && (
            <>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="self-start text-[13px] font-medium text-primary lg:hidden"
              >
                All NPCs
              </button>
              <div className="flex items-start gap-[14px]">
                <span className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-[16px] text-foreground-2">
                  {initials(npc.name)}
                </span>
                <div className="flex flex-grow flex-col gap-1">
                  <h2
                    id="npc-h"
                    className="font-display text-[30px] font-semibold leading-[1.05]"
                  >
                    {npc.name}
                  </h2>
                  {npc.description && (
                    <span className="text-[14px] italic text-foreground-2">
                      {npc.description}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setEditing(npc)}
                  className="min-h-11 rounded-[10px] border border-border-strong bg-secondary px-4 text-[14px] font-medium"
                >
                  Edit NPC
                </button>
              </div>

              <div className="grid grid-cols-3 gap-[9px]">
                {[
                  ["Class", npc.archetype && capitalize(npc.archetype)],
                  ["Race", npc.race],
                  ["Location", npc.location_name],
                ].map(([title, value]) => (
                  <div
                    key={title}
                    className="flex flex-col gap-[2px] rounded-[10px] bg-secondary px-3 py-[10px]"
                  >
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                      {title}
                    </span>
                    <span
                      className={cn(
                        "text-[14px]",
                        value ? "font-semibold" : "text-muted-foreground",
                      )}
                    >
                      {value || "not set"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-[10px]">
                <h3 className="font-display text-[20px] font-semibold">
                  Carrying
                </h3>
                <span className="font-mono text-[12px] text-muted-foreground">
                  {carrying.length} holdings
                </span>
                <button
                  type="button"
                  onClick={() => setGiving(true)}
                  className="ml-auto min-h-9 rounded-full border border-border-strong px-[13px] text-[12.5px] text-foreground-2"
                >
                  Give item
                </button>
              </div>
              <div className="flex min-h-0 flex-grow flex-col gap-[2px] overflow-y-auto pr-1">
                {carrying.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setPanel({ mode: "detail", id: h.id })}
                    className="grid grid-cols-[2.2fr_0.5fr_0.9fr] items-center gap-3 rounded-[9px] px-3 py-[10px] text-left hover:bg-secondary lg:grid-cols-[2.2fr_0.5fr_0.9fr_2.6fr]"
                  >
                    <span
                      className={cn(
                        "text-[14px] font-medium",
                        h.quantity === 0 && "text-muted-foreground",
                      )}
                    >
                      {h.item.name}{" "}
                      {h.item.homebrew && (
                        <span className="font-mono text-[10px] text-proficiency-ink">
                          HB
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[12px] text-foreground-2">
                      {h.quantity === 0 ? "0" : h.quantity}
                    </span>
                    <span
                      className={cn(
                        "justify-self-start rounded-full px-2 py-[3px] font-mono text-[11px]",
                        STATUS_CHIP[h.status],
                      )}
                    >
                      {h.status}
                    </span>
                    <span className="hidden truncate text-[13px] text-foreground-2 lg:block">
                      {h.quantity === 0 ? "none left" : (h.notes ?? "—")}
                    </span>
                  </button>
                ))}
                {carrying.length === 0 && (
                  <p className="py-6 text-center text-[13px] text-muted-foreground">
                    {npc.name} isn't carrying anything.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      )}

      <NpcForm
        npc={editing}
        open={editing !== null}
        onClose={() => setEditing(null)}
        onSave={save}
      />
      {npc && (
        <AddHolding
          open={giving}
          onClose={() => setGiving(false)}
          gameId={gameId}
          holder={{ type: "Npc", id: npc.id, name: npc.name }}
          onAdded={() => {
            reload();
            loadNpcs();
          }}
        />
      )}
    </div>
  );
};

export default NpcsSection;
