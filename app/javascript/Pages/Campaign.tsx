import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Plus } from "lucide-react";
import {
  Client,
  ICharacterType,
  IGameType,
  IJournalEntry,
  IRichNode,
} from "../Api";
import { useAuth } from "../Auth";
import { useGame } from "../Contexts";
import { useError } from "../Errors";
import { GameForm } from "../Components/Games";
import { initials } from "../Components/Shell";
import { RichPreview, useJournalPresence } from "../Components/Journal";
import { cn } from "../lib/utils";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  pending: { label: "Prepping", cls: "bg-arcane-soft text-arcane-ink" },
  active: { label: "Active", cls: "bg-vitality-soft text-vitality-ink" },
  finished: { label: "Wrapped", cls: "bg-secondary text-foreground-2" },
};

const plainText = (node: IRichNode | null | undefined): string =>
  !node
    ? ""
    : (node.text ??
      node.attrs?.label ??
      (node.content ?? []).map(plainText).join(""));

const EntryCard = ({
  entry,
  gameId,
  writers,
}: {
  entry: IJournalEntry;
  gameId: number;
  writers: string[];
}) => (
  <Link
    to={`/campaigns/${gameId}/journal/${entry.id}`}
    className={cn(
      "flex flex-col gap-2 rounded-[14px] border bg-card p-[14px] text-foreground hover:border-border-strong lg:flex-row lg:gap-[18px] lg:px-[18px] lg:py-4",
      writers.length > 0 ? "border-border-strong" : "border-border",
    )}
  >
    <div className="flex items-center gap-2 lg:w-16 lg:flex-shrink-0 lg:flex-col lg:items-start lg:gap-[2px]">
      <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground lg:block">
        Entry
      </span>
      <span className="font-mono text-[13px] font-semibold lg:text-[26px] lg:leading-none">
        {entry.number}
      </span>
      <span className="font-mono text-[11.5px] text-muted-foreground lg:hidden">
        {entry.played_on}
      </span>
    </div>
    <div className="flex min-w-0 flex-grow flex-col gap-[6px]">
      <div className="flex items-baseline gap-[10px]">
        <span className="font-display text-[19px] font-semibold">
          {entry.title || "Untitled"}
        </span>
        <span className="hidden font-mono text-[12px] text-muted-foreground lg:inline">
          {entry.played_on}
        </span>
      </div>
      {entry.preview && (
        <p className="line-clamp-2 text-[13.5px] leading-[1.6] text-foreground-2">
          <RichPreview node={entry.preview} />
        </p>
      )}
    </div>
    <div className="flex flex-shrink-0 items-center gap-2 lg:flex-col lg:items-end">
      {writers.length > 0 && (
        <span className="flex items-center gap-[6px] text-[12px] font-medium text-vitality-ink">
          <span className="h-2 w-2 rounded-full bg-vitality" />
          {writers.join(", ")} {writers.length === 1 ? "is" : "are"} writing
        </span>
      )}
      <span className="ml-auto font-mono text-[12px] text-muted-foreground lg:ml-0">
        {entry.mention_count ?? 0}{" "}
        {entry.mention_count === 1 ? "link" : "links"}
      </span>
    </div>
  </Link>
);

const PartyPanel = ({
  party,
  userId,
}: {
  party: ICharacterType[];
  userId?: number;
}) => (
  <aside className="flex w-full flex-col gap-3 self-start rounded-[14px] border border-border bg-card p-5 lg:w-80 lg:flex-shrink-0">
    <div className="flex items-baseline gap-[10px]">
      <h2 className="font-display text-[22px] font-semibold">Party</h2>
      <span className="ml-auto font-mono text-[12px] text-muted-foreground">
        {party.length} {party.length === 1 ? "hero" : "heroes"}
      </span>
    </div>
    {party.map((c) => (
      <Link
        key={c.id}
        to={`/characters/${c.id}`}
        className={cn(
          "flex min-h-[52px] items-center gap-[11px] rounded-[10px] px-[10px] py-2 text-foreground",
          c.user_id === userId && "bg-secondary",
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-arcane font-mono text-[11px] text-primary-foreground">
          {initials(c.name)}
        </span>
        <span className="flex flex-grow flex-col">
          <span className="text-[14px] font-semibold">{c.name}</span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {c.archetype} {c.level}
            {c.user_id === userId && " · you"}
          </span>
        </span>
        <span className="font-mono text-[13px] text-foreground-2">
          {c.current_hitpoints}/{c.total_hitpoints}
        </span>
      </Link>
    ))}
  </aside>
);

const Campaign = () => {
  const { id } = useParams();
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const navigate = useNavigate();
  const { setCurrentGame } = useGame();
  const [game, setGame] = useState<IGameType | null>(null);
  const [entries, setEntries] = useState<IJournalEntry[]>([]);
  const [party, setParty] = useState<ICharacterType[]>([]);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<"journal" | "party">("journal");
  const [editing, setEditing] = useState(false);
  const token = auth.getToken();
  const writing = useJournalPresence(game?.id, token);

  useEffect(() => {
    if (!id) return;
    client
      .get({ path: `/games/${id}`, token })
      .then((r) => {
        setGame(r.data);
        setCurrentGame(r.data);
      })
      .catch((e) => errors.setError(e));
    client
      .get({ path: `/games/${id}/journal_entries`, token })
      .then((r) => setEntries(r.data ?? []))
      .catch((e) => errors.setError(e));
    client
      .get({ path: `/characters?game_id=${id}`, token })
      .then((r) => setParty(r.data ?? []))
      .catch(() => setParty([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const newEntry = () =>
    client
      .post({
        path: `/games/${id}/journal_entries`,
        payload: { journal_entry: {} },
        token,
        showSuccessToast: false,
      })
      .then((r) => navigate(`/campaigns/${id}/journal/${r.data.id}`))
      .catch((e) => errors.setError(e));

  const saveGame = (attrs: Partial<IGameType>) =>
    client
      .patch({ path: `/games/${id}`, payload: { game: attrs }, token })
      .then((r) => {
        setGame(r.data);
        setCurrentGame(r.data);
      });

  if (!game?.id) return null;

  const needle = query.trim().toLowerCase();
  const visible = entries.filter(
    (e) =>
      !needle ||
      `${e.title ?? ""} ${plainText(e.preview)}`.toLowerCase().includes(needle),
  );
  const status = game.status && STATUS_LABEL[game.status];

  return (
    <div className="flex flex-col gap-[18px] p-[14px] lg:gap-[22px] lg:px-10 lg:py-[30px]">
      <div className="flex flex-col gap-[10px]">
        <Link
          to="/dashboard"
          className="hidden items-center gap-[6px] self-start text-[13px] font-medium lg:flex"
        >
          <ChevronLeft className="h-[15px] w-[15px]" />
          Campaigns
        </Link>
        <div className="flex flex-wrap items-end gap-5">
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-[10px]">
              {status && (
                <span
                  className={cn(
                    "rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em]",
                    status.cls,
                  )}
                >
                  {status.label}
                </span>
              )}
              {game.start_date && (
                <span className="font-mono text-[12px] text-muted-foreground">
                  since {game.start_date.slice(0, 10)}
                </span>
              )}
            </div>
            <h1 className="font-display text-[30px] font-semibold leading-tight lg:text-[40px]">
              {game.name}
            </h1>
            {game.description && (
              <p className="text-[14px] text-foreground-2">
                {game.description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="hidden min-h-11 rounded-[10px] border border-border-strong bg-secondary px-4 py-3 text-[14px] font-medium lg:ml-auto lg:block"
          >
            Edit campaign
          </button>
        </div>
      </div>

      <div className="flex gap-2 lg:hidden">
        <div className="flex flex-grow rounded-[11px] border border-border bg-rail p-[3px]">
          {(["journal", "party"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={cn(
                "min-h-[38px] flex-grow rounded-[8px] text-[13px] capitalize",
                section === s ? "bg-card font-semibold" : "text-foreground-2",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="New entry"
          onClick={newEntry}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-[11px] bg-primary text-primary-foreground"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <section
          aria-labelledby="journal-h"
          className={cn(
            "min-w-0 flex-grow flex-col gap-[14px]",
            section === "journal" ? "flex" : "hidden lg:flex",
          )}
        >
          <div className="hidden items-center gap-3 lg:flex">
            <h2
              id="journal-h"
              className="font-display text-[26px] font-semibold"
            >
              Journal
            </h2>
            <span className="font-mono text-[12px] text-muted-foreground">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </span>
            <label htmlFor="journal-q" className="sr-only">
              Search the journal
            </label>
            <input
              id="journal-q"
              type="search"
              placeholder="Search the journal"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ml-auto min-h-11 w-[230px] rounded-[10px] border border-border bg-card px-[13px] py-[10px] text-[14px]"
            />
            <button
              type="button"
              onClick={newEntry}
              className="flex min-h-11 items-center gap-[7px] rounded-[10px] bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New entry
            </button>
          </div>
          {visible.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              gameId={game.id!}
              writers={writing[entry.id] ?? []}
            />
          ))}
          {entries.length === 0 && (
            <p className="rounded-[14px] border border-dashed border-border-strong p-6 text-center text-[14px] text-foreground-2">
              Nothing written yet. Start the first entry after your next
              session.
            </p>
          )}
        </section>
        <div className={cn(section === "party" ? "block" : "hidden lg:block")}>
          <PartyPanel party={party} userId={auth.user?.id} />
        </div>
      </div>

      {editing && (
        <GameForm
          open={editing}
          setOpen={setEditing}
          onSubmit={saveGame}
          game={game}
        />
      )}
    </div>
  );
};

export default Campaign;
