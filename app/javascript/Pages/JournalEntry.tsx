import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Awareness } from "y-protocols/awareness";
import { Client, ICharacterType, IJournalEntry, IMentionRef } from "../Api";
import { useAuth } from "../Auth";
import { useGame } from "../Contexts";
import { useError } from "../Errors";
import { initials } from "../Components/Shell";
import {
  JournalEditor,
  useJournalPresencePing,
  useJournalSync,
} from "../Components/Journal";
import { hrefFor, missingSet, refKey } from "../Components/Journal/mentions";
import { cn } from "../lib/utils";

/** Cursor colours: the theme's accents, so a writer keeps one colour everywhere. */
const CURSOR_COLORS = [
  "--arcane",
  "--proficiency",
  "--vitality",
  "--harm",
  "--foreground-2",
].map((token) => `hsl(var(${token}))`);

interface Writer {
  name: string;
  color: string;
}

/** Everyone whose editor is open on this entry, from Yjs awareness. */
const useWriters = (awareness: Awareness | undefined): Writer[] => {
  const [writers, setWriters] = useState<Writer[]>([]);
  useEffect(() => {
    if (!awareness) return;
    const read = () =>
      setWriters(
        Array.from(awareness.getStates().values())
          .map((state: any) => state.user)
          .filter(Boolean),
      );
    read();
    awareness.on("change", read);
    return () => awareness.off("change", read);
  }, [awareness]);
  return writers;
};

const LinkGroup = ({
  title,
  links,
  missing,
}: {
  title: string;
  links: IMentionRef[];
  missing: Set<string>;
}) =>
  links.length === 0 ? null : (
    <div className="flex flex-col gap-[6px]">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
        {title}
      </span>
      {links.map((link) =>
        missing.has(refKey(link)) ? (
          <span
            key={refKey(link)}
            className="flex min-h-10 items-center gap-[9px] px-2 py-[6px] text-[14px] text-foreground-2"
          >
            <span className="flex-grow">{link.label}</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              deleted
            </span>
          </span>
        ) : (
          <Link
            key={refKey(link)}
            to={hrefFor(link)}
            className="flex min-h-10 items-center gap-[9px] rounded-[9px] px-2 py-[6px] text-[14px] text-foreground hover:bg-secondary"
          >
            <span className="flex-grow">{link.label}</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {link.type.toLowerCase()}
            </span>
          </Link>
        ),
      )}
    </div>
  );

const JournalEntry = () => {
  const { id, entryId } = useParams();
  const gameId = Number(id);
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const navigate = useNavigate();
  const { game, setCurrentGame } = useGame();
  const token = auth.getToken();
  const [entry, setEntry] = useState<IJournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [mine, setMine] = useState<ICharacterType | null>(null);
  const [links, setLinks] = useState<IMentionRef[]>([]);
  const { synced, status } = useJournalSync(Number(entryId), token);
  const writers = useWriters(synced?.awareness);

  const name = mine?.name ?? auth.user?.email.split("@")[0] ?? "Someone";
  const user = useMemo(
    () => ({
      name,
      color: CURSOR_COLORS[(auth.user?.id ?? 0) % CURSOR_COLORS.length],
    }),
    [name, auth.user?.id],
  );
  useJournalPresencePing(gameId, Number(entryId), name, token);

  useEffect(() => {
    client
      .get({ path: `/games/${gameId}/journal_entries/${entryId}`, token })
      .then((r) => {
        setEntry(r.data);
        setTitle(r.data.title ?? "");
      })
      .catch((e) => errors.setError(e));
    client
      .get({ path: `/characters?game_id=${gameId}`, token })
      .then((r) =>
        setMine(
          (r.data ?? []).find(
            (c: ICharacterType) => c.user_id === auth.user?.id,
          ) ?? null,
        ),
      )
      .catch(() => setMine(null));
    if (game?.id !== gameId)
      client
        .get({ path: `/games/${gameId}`, token })
        .then((r) => setCurrentGame(r.data))
        .catch((e) => errors.setError(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, entryId]);

  const save = (attrs: Partial<IJournalEntry>) =>
    client
      .patch({
        path: `/games/${gameId}/journal_entries/${entryId}`,
        payload: { journal_entry: attrs },
        token,
        showSuccessToast: false,
      })
      .then((r) => setEntry(r.data))
      .catch((e) => errors.setError(e));

  if (!entry) return null;

  const missing = missingSet(entry?.missing_mentions);
  const people = links.filter((l) => l.type === "Character");
  const things = links.filter((l) => l.type !== "Character");

  return (
    <div className="flex flex-col gap-4 p-[14px] pb-28 lg:px-9 lg:py-[26px]">
      <div className="flex items-center gap-2 text-[13px]">
        <Link
          to={`/campaigns/${gameId}`}
          className="flex items-center gap-[6px] font-medium"
        >
          <ChevronLeft className="h-[15px] w-[15px]" />
          {game?.id === gameId ? game.name : "Campaign"}
        </Link>
        <span className="hidden text-muted-foreground lg:inline">
          / Journal
        </span>
        <div className="ml-auto flex items-center gap-[14px]">
          <span
            className={cn(
              "flex items-center gap-[6px] text-[12px]",
              status === "live" ? "text-vitality-ink" : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                status === "live" ? "bg-vitality" : "bg-muted-foreground",
              )}
            />
            {status === "live"
              ? "Saved · live"
              : status === "offline"
                ? "Offline, reconnecting"
                : "Connecting"}
          </span>
          <div className="flex items-center">
            {writers.map((w, i) => (
              <span
                key={`${w.name}-${i}`}
                title={w.name}
                style={{ backgroundColor: w.color }}
                className={cn(
                  "flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-background font-mono text-[10.5px] text-primary-foreground",
                  i > 0 && "-ml-2",
                )}
              >
                {initials(w.name)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row">
        <article className="flex min-w-0 flex-grow flex-col gap-4 lg:rounded-[14px] lg:border lg:border-border lg:bg-card lg:px-[34px] lg:py-[26px]">
          <div className="flex flex-wrap items-end gap-[18px]">
            <div className="flex flex-col gap-[2px]">
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                Entry
              </span>
              <span className="font-mono text-[34px] font-semibold leading-none">
                {entry.number}
              </span>
            </div>
            <div className="min-w-[220px] flex-grow">
              <label htmlFor="entry-title" className="sr-only">
                Entry title
              </label>
              <input
                id="entry-title"
                type="text"
                value={title}
                placeholder="Untitled"
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => title !== (entry.title ?? "") && save({ title })}
                className="w-full border-b border-dashed border-border bg-transparent pb-[6px] font-display text-[25px] font-semibold lg:text-[30px]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="entry-date"
                className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
              >
                Played
              </label>
              <input
                id="entry-date"
                type="date"
                value={entry.played_on}
                onChange={(e) =>
                  e.target.value && save({ played_on: e.target.value })
                }
                className="min-h-10 rounded-[9px] border border-border bg-secondary px-[11px] py-2 font-mono text-[14px]"
              />
            </div>
          </div>
          {synced ? (
            <JournalEditor
              synced={synced}
              gameId={gameId}
              token={token}
              user={user}
              onLinksChange={setLinks}
              missing={missing}
            />
          ) : (
            <p className="text-[14px] text-muted-foreground">
              Opening the entry…
            </p>
          )}
        </article>

        <aside className="flex w-full flex-col gap-[14px] lg:w-[280px] lg:flex-shrink-0">
          {links.length > 0 && (
            <div className="flex flex-col gap-3 rounded-[14px] border border-border bg-card p-[18px]">
              <h2 className="font-display text-[19px] font-semibold">
                In this entry
              </h2>
              <LinkGroup title="People" links={people} missing={missing} />
              {people.length > 0 && things.length > 0 && (
                <div className="h-px bg-hairline" />
              )}
              <LinkGroup title="Things" links={things} missing={missing} />
            </div>
          )}
          {entry.previous && (
            <button
              type="button"
              onClick={() =>
                navigate(`/campaigns/${gameId}/journal/${entry.previous!.id}`)
              }
              className="flex min-h-[52px] items-center gap-[10px] rounded-[12px] border border-border bg-secondary px-[13px] py-[9px] text-left"
            >
              <ChevronLeft className="h-[15px] w-[15px] text-muted-foreground" />
              <span className="flex flex-col">
                <span className="font-mono text-[11px] text-muted-foreground">
                  Entry {entry.previous.number} · {entry.previous.played_on}
                </span>
                <span className="text-[14px] font-medium">
                  {entry.previous.title || "Untitled"}
                </span>
              </span>
            </button>
          )}
        </aside>
      </div>
    </div>
  );
};

export default JournalEntry;
