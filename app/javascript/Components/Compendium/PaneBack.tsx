import React from "react";
import { ChevronLeft } from "lucide-react";

/** The back arrow at the top of a compendium entry, like an item's. */
const PaneBack = ({ onBack, label }: { onBack: () => void; label: string }) => (
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
      {label}
    </span>
  </div>
);

export default PaneBack;
