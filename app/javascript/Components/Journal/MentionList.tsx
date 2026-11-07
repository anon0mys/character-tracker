import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Plus } from "lucide-react";
import { IMentionResult, MentionableType } from "../../Api";
import { cn } from "../../lib/utils";

type MentionKind = "people" | "things";

const GROUPS: { type: MentionableType; label: string }[] = [
  { type: "Character", label: "Characters" },
  { type: "Npc", label: "NPCs" },
  { type: "Spell", label: "Spells" },
  { type: "Monster", label: "Monsters" },
  { type: "Item", label: "Items" },
];

interface MentionListProps {
  kind: MentionKind;
  query: string;
  items: IMentionResult[];
  command: (item: IMentionResult) => void;
  onCreate?: () => void;
}

interface MentionListHandle {
  onKeyDown: (event: KeyboardEvent) => boolean;
}

/** The @ / # typeahead: results grouped by type, plus "Create NPC" / "Create item". */
const MentionList = forwardRef<MentionListHandle, MentionListProps>(
  ({ kind, query, items, command, onCreate }, ref) => {
    const canCreate = query.trim().length > 0;
    const ordered = GROUPS.flatMap(({ type }) =>
      items.filter((item) => item.type === type),
    );
    const optionCount = ordered.length + (canCreate ? 1 : 0);
    const [active, setActive] = useState(0);

    useEffect(() => setActive(0), [items, query]);

    const choose = (index: number) => {
      if (index < ordered.length) command(ordered[index]);
      else if (canCreate) onCreate?.();
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: (event) => {
        if (optionCount === 0) return false;
        if (event.key === "ArrowDown") {
          setActive((i) => (i + 1) % optionCount);
          return true;
        }
        if (event.key === "ArrowUp") {
          setActive((i) => (i - 1 + optionCount) % optionCount);
          return true;
        }
        if (event.key === "Enter") {
          choose(active);
          return true;
        }
        return false;
      },
    }));

    const tint = kind === "people" ? "bg-arcane-soft" : "bg-proficiency-soft";

    return (
      <div className="flex w-[340px] max-w-full flex-col gap-[2px] rounded-[12px] border border-border-strong bg-card p-2 text-[14px] shadow-lg">
        {GROUPS.map(({ type, label }) => {
          const group = ordered.filter((item) => item.type === type);
          if (group.length === 0) return null;
          return (
            <React.Fragment key={type}>
              <span className="px-[10px] pb-1 pt-[6px] font-mono text-[9.5px] uppercase tracking-[0.1em] text-muted-foreground">
                {label}
              </span>
              {group.map((item) => {
                const index = ordered.indexOf(item);
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(index)}
                    className={cn(
                      "flex min-h-[40px] items-center gap-[10px] rounded-[8px] px-[10px] py-2 text-left",
                      index === active && tint,
                    )}
                  >
                    <span
                      className={cn(
                        "flex-grow",
                        index === active && "font-semibold",
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="font-mono text-[11px] text-foreground-2">
                      {item.detail}
                    </span>
                  </button>
                );
              })}
            </React.Fragment>
          );
        })}
        {ordered.length === 0 && (
          <span className="px-[10px] py-2 text-[13px] text-foreground-2">
            {kind === "people"
              ? `No one in this campaign called “${query}”`
              : `No item, monster or spell called “${query}”`}
          </span>
        )}
        {canCreate && (
          <>
            <span className="mx-1 my-[4px] h-px bg-border" />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(ordered.length)}
              className={cn(
                "flex min-h-[40px] items-center gap-[9px] rounded-[8px] px-[10px] py-2 text-left font-semibold text-primary",
                active === ordered.length && "bg-harm-soft",
              )}
            >
              <Plus className="h-[15px] w-[15px]" aria-hidden="true" />
              Create {kind === "people" ? "NPC" : "item"} “{query}”
            </button>
          </>
        )}
      </div>
    );
  },
);

export default MentionList;
export type { MentionKind, MentionListHandle };
