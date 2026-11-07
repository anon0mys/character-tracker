import {
  HolderType,
  HoldingStatus,
  IHoldingType,
  goneStatuses,
} from "../../Api";

/** Sold, lost and destroyed copies stay on record but aren't "held". */
export const isGone = (holding: IHoldingType) =>
  (goneStatuses as readonly string[]).includes(holding.status);

export const heldBy = (
  holdings: IHoldingType[],
  holderType: HolderType | null,
  holderId: number | null,
) =>
  holdings.filter(
    (h) => h.holder_type === holderType && h.holder_id === holderId,
  );

/** The holdings inside a container holding. */
export const contentsOf = (holdings: IHoldingType[], container: IHoldingType) =>
  heldBy(holdings, "Holding", container.id);

export const isContainer = (holdings: IHoldingType[], holding: IHoldingType) =>
  holdings.some(
    (h) => h.holder_type === "Holding" && h.holder_id === holding.id,
  );

/** The short line under a holding's name: charges, notes, or homebrew. */
export const holdingMeta = (holding: IHoldingType) => {
  const parts: string[] = [];
  if (holding.item.homebrew) parts.push("homebrew");
  if (holding.notes) parts.push(holding.notes.split("\n")[0]);
  return parts.join(" · ");
};

export const STATUS_CHIP: Record<HoldingStatus, string> = {
  equipped: "bg-proficiency-soft text-proficiency-ink",
  carried: "bg-secondary text-foreground-2",
  stored: "bg-arcane-soft text-arcane-ink",
  sold: "bg-secondary text-muted-foreground",
  lost: "bg-secondary text-muted-foreground",
  destroyed: "bg-harm-soft text-harm",
};
