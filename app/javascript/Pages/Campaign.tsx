import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Camera, ChevronLeft, Plus } from "lucide-react";
import {
  Client,
  ICharacterType,
  IGameType,
  IJournalEntry,
  IJournalPageImport,
  IRichNode,
} from "../Api";
import { useAuth } from "../Auth";
import { useGame } from "../Contexts";
import { useError } from "../Errors";
import { GameForm, MembersDialog } from "../Components/Games";
import { initials } from "../Components/Shell";
import {
  PageImportDialog,
  RichPreview,
  SearchSnippet,
  useJournalPresence,
} from "../Components/Journal";
import {
  CampaignInventory,
  LocationsSection,
  NpcsSection,
} from "../Components/Inventory";
import { missingSet } from "../Components/Journal/mentions";
import { cn } from "../lib/utils";

type Section = "journal" | "party" | "inventory" | "npcs" | "locations";
const SECTIONS: Section[] = [
  "journal",
  "party",
  "inventory",
  "npcs",
  "locations",
];
const DESKTOP_SECTIONS: Section[] = [
  "journal",
  "inventory",
  "npcs",
  "locations",
];
const SECTION_LABEL: Record<Section, string> = {
  journal: "Journal",
  party: "Party",
  inventory: "Inventory",
  npcs: "NPCs",
  locations: "Places",
};

/** Shorter queries just filter titles and previews in the browser. */
const MIN_SEARCH = 2;
const SEARCH_DELAY_MS = 250;

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
      {entry.snippet ? (
        <p className="line-clamp-3 text-[13.5px] leading-[1.6] text-foreground-2">
          <SearchSnippet text={entry.snippet} />
        </p>
      ) : (
        entry.preview && (
          <p className="line-clamp-2 text-[13.5px] leading-[1.6] text-foreground-2">
            <RichPreview
              node={entry.preview}
              missing={missingSet(entry.missing_mentions)}
            />
          </p>
        )
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
  /** Server search hits for the current query; null until they arrive. */
  const [results, setResults] = useState<IJournalEntry[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const requested = searchParams.get("section") as Section | null;
  const section: Section =
    requested && SECTIONS.includes(requested) ? requested : "journal";
  const setSection = (s: Section) =>
    setSearchParams(s === "journal" ? {} : { section: s }, { replace: true });
  const onBoard =
    section === "inventory" || section === "npcs" || section === "locations";
  const [editing, setEditing] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  /** Photo imports of journal pages still being read or reviewed. */
  const [pageImports, setPageImports] = useState<IJournalPageImport[]>([]);
  const [importing, setImporting] = useState<{ id: number | null } | null>(
    null,
  );
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
    loadEntries();
    loadPageImports();
    client
      .get({ path: `/characters?game_id=${id}`, token })
      .then((r) => setParty(r.data ?? []))
      .catch(() => setParty([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const needle = query.trim().toLowerCase();
  const searching = needle.length >= MIN_SEARCH;

  // Full-text search runs on the server, a moment after typing stops. Until
  // its hits arrive the list filters titles and previews locally.
  useEffect(() => {
    setResults(null);
    if (!id || !searching) return;
    let current = true;
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ q: needle });
      client
        .get({ path: `/games/${id}/journal_entries?${params}`, token })
        .then((r) => current && setResults(r.data ?? []))
        .catch(() => current && setResults(null));
    }, SEARCH_DELAY_MS);
    return () => {
      current = false;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, needle, searching]);

  const loadEntries = () =>
    client
      .get({ path: `/games/${id}/journal_entries`, token })
      .then((r) => setEntries(r.data ?? []))
      .catch((e) => errors.setError(e));

  const loadPageImports = () =>
    client
      .get({ path: `/games/${id}/journal_page_imports`, token })
      .then((r) => setPageImports(r.data ?? []))
      .catch(() => setPageImports([]));

  // A page import being read: look again shortly, so its banner turns into
  // "ready to review" without a reload.
  useEffect(() => {
    if (!pageImports.some((p) => p.status === "transcribing")) return;
    const timer = setTimeout(loadPageImports, 8000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageImports]);

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

  const visible =
    searching && results
      ? results
      : entries.filter(
          (e) =>
            !needle ||
            `${e.title ?? ""} ${plainText(e.preview)}`
              .toLowerCase()
              .includes(needle),
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
          <div className="hidden items-center gap-3 lg:ml-auto lg:flex">
            <div className="flex rounded-[10px] border border-border bg-rail p-[3px]">
              {DESKTOP_SECTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={
                    section === s || (s === "journal" && section === "party")
                  }
                  onClick={() => setSection(s)}
                  className={cn(
                    "min-h-[38px] rounded-[8px] px-4 text-[13px]",
                    section === s || (s === "journal" && section === "party")
                      ? "bg-card font-semibold"
                      : "text-foreground-2",
                  )}
                >
                  {SECTION_LABEL[s]}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowMembers(true)}
              className="min-h-11 rounded-[10px] border border-border-strong bg-secondary px-4 py-3 text-[14px] font-medium"
            >
              Members
            </button>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="min-h-11 rounded-[10px] border border-border-strong bg-secondary px-4 py-3 text-[14px] font-medium"
            >
              Edit campaign
            </button>
          </div>
        </div>
      </div>

      {/* Phones: tabs get their own row (scrolling if they must), then the
          section's actions as labelled buttons. */}
      <div className="flex flex-col gap-2 lg:hidden">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowMembers(true)}
            className="min-h-11 flex-1 rounded-[10px] border border-border-strong bg-secondary px-3 text-[14px] font-medium"
          >
            Members
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="min-h-11 flex-1 rounded-[10px] border border-border-strong bg-secondary px-3 text-[14px] font-medium"
          >
            Edit campaign
          </button>
        </div>
        <div className="-mx-[14px] overflow-x-auto px-[14px] [scrollbar-width:none]">
          <div
            role="tablist"
            className="flex w-max min-w-full rounded-[11px] border border-border bg-rail p-[3px]"
          >
            {SECTIONS.map((s) => (
              <button
                key={s}
                type="button"
                role="tab"
                aria-selected={section === s}
                onClick={() => setSection(s)}
                className={cn(
                  "min-h-[40px] flex-grow whitespace-nowrap rounded-[8px] px-3 text-[13px]",
                  section === s ? "bg-card font-semibold" : "text-foreground-2",
                )}
              >
                {SECTION_LABEL[s]}
              </button>
            ))}
          </div>
        </div>
        {section === "journal" && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setImporting({ id: null })}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[10px] border border-border-strong bg-secondary px-3 text-[14px] font-medium"
            >
              <Camera className="h-4 w-4" />
              Import pages
            </button>
            <button
              type="button"
              onClick={newEntry}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[10px] bg-primary px-3 text-[14px] font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New entry
            </button>
          </div>
        )}
      </div>

      {section === "inventory" && (
        <CampaignInventory gameId={game.id!} party={party} />
      )}
      {section === "npcs" && <NpcsSection gameId={game.id!} />}
      {section === "locations" && <LocationsSection gameId={game.id!} />}

      <div
        className={cn(
          "flex-col gap-5 lg:flex-row",
          onBoard ? "hidden" : "flex",
        )}
      >
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
              {needle
                ? `${visible.length} of ${entries.length}`
                : `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
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
              onClick={() => setImporting({ id: null })}
              className="flex min-h-11 items-center gap-[7px] rounded-[10px] border border-border-strong bg-secondary px-4 py-3 text-[14px] font-medium"
            >
              <Camera className="h-4 w-4" />
              Import pages
            </button>
            <button
              type="button"
              onClick={newEntry}
              className="flex min-h-11 items-center gap-[7px] rounded-[10px] bg-primary px-4 py-3 text-[14px] font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              New entry
            </button>
          </div>
          {pageImports.map((pageImport) => (
            <button
              key={pageImport.id}
              type="button"
              onClick={() => setImporting({ id: pageImport.id })}
              className="flex min-h-[52px] items-center gap-3 rounded-[14px] border border-dashed border-border-strong bg-secondary px-4 py-3 text-left text-[14px]"
            >
              <Camera className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              <span className="flex-grow">
                {pageImport.status === "transcribing" &&
                  `Reading ${pageImport.page_count} photographed ${pageImport.page_count === 1 ? "page" : "pages"}…`}
                {pageImport.status === "ready" &&
                  `${pageImport.entries.length} ${pageImport.entries.length === 1 ? "entry" : "entries"} from your photos ${pageImport.entries.length === 1 ? "is" : "are"} ready to review`}
                {pageImport.status === "failed" &&
                  "Your photographed pages couldn't be read"}
              </span>
              <span className="font-medium text-primary">
                {pageImport.status === "transcribing" ? "View" : "Review"}
              </span>
            </button>
          ))}
          {visible.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              gameId={game.id!}
              writers={writing[entry.id] ?? []}
            />
          ))}
          {needle &&
            (!searching || results) &&
            entries.length > 0 &&
            visible.length === 0 && (
              <p className="rounded-[14px] border border-dashed border-border-strong p-6 text-center text-[14px] text-foreground-2">
                No entries mention “{query.trim()}”.
              </p>
            )}
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

      {importing && (
        <PageImportDialog
          open={importing !== null}
          setOpen={(open) => !open && setImporting(null)}
          gameId={game.id!}
          importId={importing.id}
          onAdded={loadEntries}
          onChanged={loadPageImports}
        />
      )}
      <MembersDialog
        open={showMembers}
        setOpen={setShowMembers}
        gameId={game.id!}
      />
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
