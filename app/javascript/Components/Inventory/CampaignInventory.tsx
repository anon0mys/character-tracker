import React, { useState } from "react";
import { ChevronDown, ChevronRight, Package } from "lucide-react";
import { HolderType, ICharacterType, IHoldingType } from "../../Api";
import { cn } from "../../lib/utils";
import { initials } from "../Shell";
import AddHolding from "./AddHolding";
import HoldingDetail from "./HoldingDetail";
import MoveHolding from "./MoveHolding";
import { STATUS_CHIP, isGone } from "./holdings";
import { useCampaignHoldings } from "./useCampaignHoldings";

type Filter = "held" | "equipped" | "stored" | "gone";
type Panel =
  | { mode: "jump" }
  | { mode: "detail"; id: number }
  | { mode: "move"; holding: IHoldingType };

interface Container {
  key: string;
  holding: IHoldingType;
  rows: IHoldingType[];
}

/** One holder's card: what they hold directly, plus their containers. */
interface Card {
  key: string;
  type: HolderType | null;
  id: number | null;
  name: string;
  rows: IHoldingType[];
  containers: Container[];
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: "held", label: "Held" },
  { key: "equipped", label: "Equipped" },
  { key: "stored", label: "Stored" },
  { key: "gone", label: "Gone" },
];

const PREVIEW = 3;
const cols =
  "grid grid-cols-[2.6fr_0.5fr_1fr] gap-3 lg:grid-cols-[2.6fr_0.5fr_1fr_2.4fr]";

const holderKey = (type: HolderType | null, id: number | null) =>
  `${type ?? "none"}-${id ?? 0}`;

const matches = (h: IHoldingType, filter: Filter) =>
  filter === "held"
    ? !isGone(h)
    : filter === "gone"
      ? isGone(h)
      : h.status === filter;

/** Climb out of containers to the person, place or NPC that has it. */
const ownerOf = (h: IHoldingType, all: IHoldingType[]): IHoldingType => {
  let current = h;
  while (current.holder_type === "Holding") {
    const parent = all.find((c) => c.id === current.holder_id);
    if (!parent) break;
    current = parent;
  }
  return current;
};

/**
 * Cards for the visible holdings. A container gets a card nested in its
 * owner's card (the owner's card appears even if only the container matched),
 * and leaves its owner's plain rows.
 */
const buildCards = (visible: IHoldingType[], all: IHoldingType[]): Card[] => {
  const cards = new Map<string, Card>();
  const cardFor = (h: IHoldingType) => {
    const key = holderKey(h.holder_type, h.holder_id);
    if (!cards.has(key))
      cards.set(key, {
        key,
        type: h.holder_type,
        id: h.holder_id,
        name: h.holder_name ?? "Not placed",
        rows: [],
        containers: [],
      });
    return cards.get(key)!;
  };

  const containerRows = new Map<number, IHoldingType[]>();
  visible.forEach((h) => {
    if (h.holder_type === "Holding") {
      const list = containerRows.get(h.holder_id!) ?? [];
      list.push(h);
      containerRows.set(h.holder_id!, list);
    } else {
      cardFor(h).rows.push(h);
    }
  });

  containerRows.forEach((rows, containerId) => {
    const container = all.find((c) => c.id === containerId);
    if (!container) return;
    const card = cardFor(ownerOf(container, all));
    card.rows = card.rows.filter((r) => r.id !== container.id);
    card.containers.push({
      key: `Holding-${container.id}`,
      holding: container,
      rows,
    });
  });

  return [...cards.values()];
};

const sortCards = (cards: Card[], type: HolderType | null) =>
  cards
    .filter((c) => c.type === type)
    .sort((a, b) => a.name.localeCompare(b.name));

const HoldingRows = ({
  rows,
  limit,
  selectedId,
  onOpen,
}: {
  rows: IHoldingType[];
  limit: number;
  selectedId?: number;
  onOpen: (h: IHoldingType) => void;
}) => (
  <>
    {rows.slice(0, limit).map((h) => (
      <button
        key={h.id}
        type="button"
        onClick={() => onOpen(h)}
        className={cn(
          cols,
          "items-center rounded-[9px] px-[10px] py-[9px] text-left hover:bg-secondary",
          selectedId === h.id && "bg-proficiency-soft",
        )}
      >
        <span
          className={cn(
            "text-[14px]",
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
        <span className="font-mono text-[13px]">{h.quantity}</span>
        <span
          className={cn(
            "justify-self-start rounded-full px-2 py-[3px] font-mono text-[11px]",
            STATUS_CHIP[h.status],
          )}
        >
          {h.status}
        </span>
        <span className="hidden truncate text-[13px] text-foreground-2 lg:block">
          {h.notes ?? "—"}
        </span>
      </button>
    ))}
  </>
);

const MoreToggle = ({
  total,
  open,
  label,
  onToggle,
}: {
  total: number;
  open: boolean;
  label: string;
  onToggle: () => void;
}) =>
  total > PREVIEW ? (
    <button
      type="button"
      onClick={onToggle}
      className="self-start px-[10px] py-[6px] text-[12.5px] font-medium text-primary"
    >
      {open ? "Show fewer" : `${total - PREVIEW} more ${label}`}
    </button>
  ) : null;

const CampaignInventory = ({
  gameId,
  party,
}: {
  gameId: number;
  party: ICharacterType[];
}) => {
  const { holdings, loading, reload } = useCampaignHoldings(gameId);
  const [filter, setFilter] = useState<Filter>("held");
  const [query, setQuery] = useState("");
  const [opened, setOpened] = useState<string[] | null>(null);
  const [showAll, setShowAll] = useState<string[]>([]);
  const [closedBags, setClosedBags] = useState<string[]>([]);
  const [panel, setPanel] = useState<Panel>({ mode: "jump" });
  const [adding, setAdding] = useState(false);

  const needle = query.trim().toLowerCase();
  const visible = holdings.filter(
    (h) =>
      matches(h, filter) &&
      (!needle || h.item.name.toLowerCase().includes(needle)),
  );
  const cards = buildCards(visible, holdings);
  const partyCards = sortCards(cards, "Character");
  const worldCards = [
    ...sortCards(cards, "Location"),
    ...sortCards(cards, "Npc"),
  ];
  const unplaced = sortCards(cards, null);
  const ordered = [...partyCards, ...worldCards, ...unplaced];

  // Searching or narrowing the status opens every card with a match;
  // otherwise only the first starts open until someone toggles.
  const narrowed = filter !== "held" || needle !== "";
  const openKeys = opened ?? (ordered[0] ? [ordered[0].key] : []);
  const isOpen = (key: string) => narrowed || openKeys.includes(key);
  const toggle = (key: string) =>
    setOpened(
      openKeys.includes(key)
        ? openKeys.filter((k) => k !== key)
        : [...openKeys, key],
    );
  const allOpen = ordered.every((c) => isOpen(c.key));
  const toggleShowAll = (key: string) =>
    setShowAll((keys) =>
      keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key],
    );

  const jumpTo = (key: string) => {
    if (!openKeys.includes(key)) setOpened([...openKeys, key]);
    requestAnimationFrame(() =>
      document
        .getElementById(`holder-${key}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const selectedId = panel.mode === "detail" ? panel.id : undefined;
  const open = (h: IHoldingType) => setPanel({ mode: "detail", id: h.id });
  const member = (card: Card) =>
    card.type === "Character"
      ? party.find((c) => Number(c.id) === card.id)
      : undefined;
  const heldCount = (card: Card) => card.rows.length + card.containers.length;

  const renderCard = (card: Card) => {
    const character = card.type === "Character";
    const expanded = isOpen(card.key);
    const who = member(card);
    const summary = [
      who && `${who.archetype} ${who.level}`,
      `${heldCount(card)} held`,
      card.containers.length > 0 &&
        `${card.containers.length} ${card.containers.length === 1 ? "container" : "containers"}`,
    ]
      .filter(Boolean)
      .join(" · ");

    return (
      <div
        key={card.key}
        id={`holder-${card.key}`}
        className={cn(
          "flex flex-shrink-0 scroll-mt-4 flex-col overflow-hidden rounded-[14px] border",
          character
            ? "border-border-strong bg-card"
            : "border-dashed border-border-strong bg-secondary/40",
        )}
      >
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => toggle(card.key)}
          className={cn(
            "flex min-h-[56px] items-center gap-3 px-4 py-[10px] text-left",
            expanded &&
              character &&
              "border-b border-proficiency-soft bg-proficiency-soft",
            expanded && !character && "border-b border-hairline",
          )}
        >
          {character && (
            <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-arcane font-mono text-[12px] text-primary-foreground">
              {initials(card.name)}
            </span>
          )}
          <span className="flex flex-grow flex-col gap-[1px]">
            <span
              className={cn(
                "flex items-center gap-2",
                character
                  ? "font-display text-[19px] font-semibold"
                  : "text-[15px] font-semibold",
                card.type === null && "text-primary",
              )}
            >
              {card.name}
              {card.type === "Npc" && (
                <span className="rounded-full bg-background px-[7px] py-[2px] font-mono text-[10px] uppercase tracking-[0.08em] text-foreground-2">
                  NPC
                </span>
              )}
            </span>
            <span className="font-mono text-[10.5px] text-muted-foreground">
              {summary}
            </span>
          </span>
          {expanded ? (
            <ChevronDown className="h-4 w-4 text-foreground-2" />
          ) : (
            <ChevronRight className="h-4 w-4 text-foreground-2" />
          )}
        </button>

        {expanded && (
          <div className="flex flex-col px-2 pb-[10px] pt-[6px]">
            <HoldingRows
              rows={card.rows}
              limit={showAll.includes(card.key) ? card.rows.length : PREVIEW}
              selectedId={selectedId}
              onOpen={open}
            />
            <MoreToggle
              total={card.rows.length}
              open={showAll.includes(card.key)}
              label={`on ${card.name}`}
              onToggle={() => toggleShowAll(card.key)}
            />
            {card.containers.map((c) => {
              const bagOpen = narrowed || !closedBags.includes(c.key);
              return (
                <div
                  key={c.key}
                  className="mx-[6px] mt-[2px] flex flex-col overflow-hidden rounded-[11px] border border-border bg-secondary/50 lg:ml-7"
                >
                  <div className="flex items-center border-b border-hairline">
                    <button
                      type="button"
                      onClick={() => open(c.holding)}
                      className="flex min-h-[46px] flex-grow items-center gap-[10px] px-3 text-left"
                    >
                      <Package
                        className="h-4 w-4 text-foreground-2"
                        aria-hidden
                      />
                      <span className="flex-grow text-[14.5px] font-semibold">
                        {c.holding.item.name}
                      </span>
                      <span className="rounded-full bg-background px-2 py-[2px] font-mono text-[11px] text-foreground-2">
                        {c.rows.length} inside ·{" "}
                        {c.rows.reduce((n, r) => n + r.quantity, 0)} items
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-expanded={bagOpen}
                      aria-label={
                        bagOpen
                          ? `Close ${c.holding.item.name}`
                          : `Open ${c.holding.item.name}`
                      }
                      onClick={() =>
                        setClosedBags((keys) =>
                          keys.includes(c.key)
                            ? keys.filter((k) => k !== c.key)
                            : [...keys, c.key],
                        )
                      }
                      className="flex h-[46px] w-11 items-center justify-center text-foreground-2"
                    >
                      {bagOpen ? (
                        <ChevronDown className="h-[14px] w-[14px]" />
                      ) : (
                        <ChevronRight className="h-[14px] w-[14px]" />
                      )}
                    </button>
                  </div>
                  {bagOpen && (
                    <div className="flex flex-col px-[6px] pb-2 pt-1">
                      <HoldingRows
                        rows={c.rows}
                        limit={
                          showAll.includes(c.key) ? c.rows.length : PREVIEW
                        }
                        selectedId={selectedId}
                        onOpen={open}
                      />
                      <MoreToggle
                        total={c.rows.length}
                        open={showAll.includes(c.key)}
                        label={`in the ${c.holding.item.name.toLowerCase()}`}
                        onToggle={() => toggleShowAll(c.key)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {card.rows.length === 0 && card.containers.length === 0 && (
              <p className="px-[10px] py-2 text-[13px] text-muted-foreground">
                Nothing here.
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-[6px] overflow-x-auto">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
              className={cn(
                "min-h-[38px] flex-shrink-0 rounded-full border px-[14px] text-[13px]",
                filter === key
                  ? "border-foreground bg-foreground font-semibold text-background"
                  : "border-border bg-card text-foreground-2",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={narrowed}
          onClick={() => setOpened(allOpen ? [] : ordered.map((c) => c.key))}
          className="min-h-[38px] rounded-full border border-border-strong px-[14px] text-[12.5px] text-foreground-2 disabled:opacity-40 lg:ml-auto"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
        <label htmlFor="inventory-q" className="sr-only">
          Search inventory
        </label>
        <input
          id="inventory-q"
          type="search"
          placeholder="Search inventory"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-11 flex-grow rounded-[10px] border border-border bg-card px-[13px] text-[14px] lg:w-[220px] lg:flex-grow-0"
        />
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="min-h-11 rounded-[10px] bg-primary px-4 text-[14px] font-semibold text-primary-foreground"
        >
          Add holding
        </button>
      </div>

      <div className="flex min-h-0 flex-col gap-[18px] lg:flex-row">
        <section
          aria-label="Holders"
          className={cn(
            "min-w-0 flex-grow flex-col gap-3",
            panel.mode === "jump" ? "flex" : "hidden lg:flex",
          )}
        >
          {loading && (
            <p className="py-8 text-center text-[13px] text-muted-foreground">
              Loading inventory…
            </p>
          )}
          {!loading && ordered.length === 0 && (
            <p className="rounded-[14px] border border-dashed border-border-strong p-6 text-center text-[13px] text-muted-foreground">
              Nothing here.
            </p>
          )}
          {partyCards.map(renderCard)}
          {worldCards.length > 0 && (
            <span className="px-1 pt-[6px] font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              Places &amp; NPCs
            </span>
          )}
          {worldCards.map(renderCard)}
          {unplaced.map(renderCard)}
        </section>

        <aside
          aria-label={panel.mode === "jump" ? "Jump to" : "Holding"}
          className={cn(
            "flex w-full flex-shrink-0 flex-col gap-1 self-start rounded-[14px] border bg-card p-[14px] lg:sticky lg:top-4 lg:max-h-[calc(100vh-120px)]",
            panel.mode === "jump"
              ? "hidden border-border lg:flex lg:w-[240px]"
              : "min-h-[560px] border-border-strong lg:w-[400px]",
          )}
        >
          {panel.mode === "detail" && (
            <HoldingDetail
              gameId={gameId}
              holdingId={panel.id}
              onBack={() => setPanel({ mode: "jump" })}
              onMove={(h) => setPanel({ mode: "move", holding: h })}
              onChanged={reload}
              backLabel="Back to inventory"
            />
          )}
          {panel.mode === "move" && (
            <MoveHolding
              gameId={gameId}
              holding={panel.holding}
              holdings={holdings}
              onBack={() => setPanel({ mode: "detail", id: panel.holding.id })}
              onMoved={() => {
                reload();
                setPanel({ mode: "jump" });
              }}
            />
          )}
          {panel.mode === "jump" && (
            <>
              <span className="px-[6px] pb-[6px] pt-[2px] font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                Jump to
              </span>
              {ordered.map((card) => (
                <React.Fragment key={card.key}>
                  <button
                    type="button"
                    onClick={() => jumpTo(card.key)}
                    className={cn(
                      "flex min-h-[34px] items-center rounded-[8px] px-2 text-left text-[13.5px] hover:bg-secondary",
                      isOpen(card.key) && "font-semibold",
                    )}
                  >
                    <span className="flex-grow">{card.name}</span>
                    <span className="font-mono text-[12px] text-foreground-2">
                      {heldCount(card)}
                    </span>
                  </button>
                  {card.containers.map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => jumpTo(card.key)}
                      className="flex min-h-[34px] items-center rounded-[8px] py-1 pl-6 pr-2 text-left text-[13px] text-foreground-2 hover:bg-secondary"
                    >
                      <span className="flex-grow">{c.holding.item.name}</span>
                      <span className="font-mono text-[12px]">
                        {c.rows.length}
                      </span>
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </>
          )}
        </aside>
      </div>

      <AddHolding
        open={adding}
        onClose={() => setAdding(false)}
        gameId={gameId}
        onAdded={reload}
      />
    </div>
  );
};

export default CampaignInventory;
