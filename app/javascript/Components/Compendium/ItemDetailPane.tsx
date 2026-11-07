import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Client, IHoldingType, IItemType } from "../../Api";
import { useAuth } from "../../Auth";
import { useGame } from "../../Contexts";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";
import { MentionedInJournal } from "../Journal";
import { ItemForm } from "../Items";
import { isGone } from "../Inventory";

const badge =
  "rounded-full px-[9px] py-[3px] font-mono text-[10px] uppercase tracking-[0.08em]";

/** Who holds this item in the current campaign. */
const HeldIn = ({ itemId }: { itemId: number }) => {
  const auth = useAuth();
  const client = Client();
  const { game } = useGame();
  const [holdings, setHoldings] = useState<IHoldingType[]>([]);

  useEffect(() => {
    if (!game?.id) return;
    client
      .get({
        path: `/games/${game.id}/holdings?item_id=${itemId}`,
        token: auth.getToken(),
      })
      .then((res) =>
        setHoldings((res.data ?? []).filter((h: IHoldingType) => !isGone(h))),
      )
      .catch(() => setHoldings([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, game?.id]);

  if (!game?.id || holdings.length === 0) return null;

  return (
    <div className="flex flex-col gap-[6px] border-t border-hairline pt-3">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Held in {game.name}
      </span>
      {holdings.map((h) => (
        <Link
          key={h.id}
          to={`/campaigns/${game.id}?section=inventory`}
          className="flex min-h-[40px] items-center gap-2 rounded-[9px] bg-secondary px-[10px] text-[13.5px] text-foreground"
        >
          <span className="flex-grow">{h.holder_name ?? "Not placed"}</span>
          <span className="font-mono text-[11px] text-foreground-2">
            ×{h.quantity}
          </span>
        </Link>
      ))}
    </div>
  );
};

const ItemDetailPane = ({
  item,
  onClose,
}: {
  item: IItemType;
  onClose: () => void;
}) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div className="flex items-center gap-2">
        {item.homebrew && (
          <span className={cn(badge, "bg-proficiency text-primary-foreground")}>
            Homebrew
          </span>
        )}
        {item.source && (
          <span className="font-mono text-[11px] text-muted-foreground">
            {item.source}
          </span>
        )}
        {item.homebrew && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="ml-auto min-h-9 rounded-[9px] border border-border-strong bg-secondary px-[13px] text-[13px] font-medium"
          >
            Edit
          </button>
        )}
        <button
          type="button"
          aria-label="Close detail"
          onClick={onClose}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-secondary",
            !item.homebrew && "ml-auto",
          )}
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>
      <h2 className="font-display text-[26px] font-semibold leading-tight">
        {item.name}
      </h2>
      <div className="flex flex-wrap gap-2">
        <span className={cn(badge, "bg-secondary text-foreground-2")}>
          {item.item_type}
        </span>
        {item.quality && (
          <span
            className={cn(badge, "bg-proficiency-soft text-proficiency-ink")}
          >
            {item.quality.replace(/_/g, " ")}
          </span>
        )}
        {item.requires_attunement && (
          <span className={cn(badge, "bg-arcane-soft text-arcane-ink")}>
            attunement
          </span>
        )}
        {(item.tags ?? []).map((t) => (
          <span
            key={t}
            className="rounded-full bg-proficiency-soft px-[10px] py-1 text-[12px] text-proficiency-ink"
          >
            {t}
          </span>
        ))}
      </div>
      {item.description ? (
        <p className="whitespace-pre-line text-[14px] leading-relaxed">
          {item.description}
        </p>
      ) : (
        <p className="text-[13px] text-muted-foreground">No description.</p>
      )}
      {item.id && <HeldIn itemId={item.id} />}
      <MentionedInJournal type="Item" id={item.id} />
      {editing && (
        <ItemForm item={item} open={editing} close={() => setEditing(false)} />
      )}
    </div>
  );
};

export default ItemDetailPane;
