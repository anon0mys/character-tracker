import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Client, IJournalBacklink, MentionableType } from "../../Api";
import { useAuth } from "../../Auth";
import { useGame } from "../../Contexts";
import { cn } from "../../lib/utils";

interface MentionedInJournalProps {
  type: MentionableType;
  id: number | null | undefined;
  className?: string;
}

/** Backlinks: entries in the current campaign's journal that mention this person or thing. */
const MentionedInJournal = ({
  type,
  id,
  className,
}: MentionedInJournalProps) => {
  const auth = useAuth();
  const { game } = useGame();
  const [rows, setRows] = useState<IJournalBacklink[]>([]);

  useEffect(() => {
    const token = auth.getToken();
    if (!token || !game?.id || !id) {
      setRows([]);
      return;
    }
    const params = new URLSearchParams({ type, id: String(id) });
    Client()
      .get({ path: `/games/${game.id}/journal_mentions?${params}`, token })
      .then((res) => setRows(res.data ?? []))
      .catch(() => setRows([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id, type, id]);

  if (!game || rows.length === 0) return null;

  return (
    <section
      className={cn(
        "flex flex-col gap-[10px] border-t border-hairline pt-[14px]",
        className,
      )}
    >
      <div className="flex items-baseline gap-2">
        <h3 className="font-display text-[18px] font-semibold">
          Mentioned in the Journal
        </h3>
        <span className="ml-auto font-mono text-[12px] text-muted-foreground">
          {rows.length} {rows.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <span className="text-[12.5px] text-foreground-2">
        In {game.name}, your current campaign
      </span>
      {rows.map((row) => (
        <Link
          key={row.entry_id}
          to={`/campaigns/${game.id}/journal/${row.entry_id}`}
          className="flex flex-col gap-[3px] rounded-[10px] px-[11px] py-[9px] text-foreground hover:bg-secondary"
        >
          <span className="flex items-baseline gap-2">
            <span className="font-mono text-[12px] font-semibold">
              {row.number}
            </span>
            <span className="text-[14px] font-medium">
              {row.title || "Untitled"}
            </span>
            <span className="ml-auto font-mono text-[11px] text-muted-foreground">
              {row.played_on}
            </span>
          </span>
          {row.excerpt && (
            <span className="text-[13px] leading-normal text-foreground-2">
              {row.excerpt}
            </span>
          )}
        </Link>
      ))}
    </section>
  );
};

export default MentionedInJournal;
