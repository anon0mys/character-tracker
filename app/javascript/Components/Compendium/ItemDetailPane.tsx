import React from "react";
import { IItemType } from "../../Api";
import { cn } from "../../lib/utils";
import { X } from "lucide-react";

const badge =
  "rounded-full px-[9px] py-[3px] font-mono text-[10px] uppercase tracking-[0.08em]";

const ItemDetailPane = ({
  item,
  onClose,
}: {
  item: IItemType;
  onClose: () => void;
}) => (
  <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
    <div className="flex items-start gap-2">
      <h2 className="font-display text-[26px] font-semibold leading-tight">
        {item.name}
      </h2>
      <button
        type="button"
        aria-label="Close detail"
        onClick={onClose}
        className="ml-auto flex h-9 w-9 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-secondary"
      >
        <X className="h-[18px] w-[18px]" />
      </button>
    </div>
    <div className="flex flex-wrap gap-2">
      <span className={cn(badge, "bg-secondary text-foreground-2")}>
        {item.item_type}
      </span>
      {item.quality && (
        <span className={cn(badge, "bg-proficiency-soft text-proficiency-ink")}>
          {item.quality.replace(/_/g, " ")}
        </span>
      )}
      {item.requires_attunement && (
        <span className={cn(badge, "bg-arcane-soft text-arcane-ink")}>
          attunement
        </span>
      )}
    </div>
    {item.description ? (
      <p className="whitespace-pre-line text-[14px] leading-relaxed">
        {item.description}
      </p>
    ) : (
      <p className="text-[13px] text-muted-foreground">No description.</p>
    )}
  </div>
);

export default ItemDetailPane;
