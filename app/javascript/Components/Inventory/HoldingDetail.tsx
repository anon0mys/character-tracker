import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import { Client, HoldingStatus, IHoldingType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { cn } from "../../lib/utils";
import { STATUS_CHIP, isGone } from "./holdings";

interface HoldingDetailProps {
  gameId: number;
  holdingId: number;
  onBack: () => void;
  onMove: (holding: IHoldingType) => void;
  onChanged: () => void;
  backLabel?: string;
}

const KEPT: HoldingStatus[] = ["equipped", "carried", "stored"];

const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Takes over the panel it came from (back arrow at top) — never an overlay.
const HoldingDetail = ({
  gameId,
  holdingId,
  onBack,
  onMove,
  onChanged,
  backLabel = "Back to gear",
}: HoldingDetailProps) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [holding, setHolding] = useState<IHoldingType | null>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const path = `/games/${gameId}/holdings/${holdingId}`;

  useEffect(() => {
    client
      .get({ path, token: auth.getToken() })
      .then((res) => {
        setHolding(res.data);
        setNotes(res.data.notes ?? "");
      })
      .catch((err) => errors.setError(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdingId]);

  const save = (attrs: Partial<IHoldingType>, toast = false) =>
    client
      .patch({
        path,
        payload: { holding: attrs },
        token: auth.getToken(),
        showSuccessToast: toast,
      })
      .then((res) => {
        setHolding(res.data);
        onChanged();
      })
      .catch((err) => errors.setError(err));

  if (!holding)
    return (
      <p className="py-6 text-center text-[13px] text-muted-foreground">
        Loading…
      </p>
    );

  const item = holding.item;
  const subtitle = [
    item.item_type,
    item.quality?.replace(/_/g, " "),
    item.homebrew ? "homebrew" : item.source,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-[13px]">
      <div className="flex flex-shrink-0 items-center gap-[9px]">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] border border-border bg-secondary text-foreground-2"
        >
          <ChevronLeft className="h-[17px] w-[17px]" />
        </button>
        <span className="flex-grow font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          {backLabel}
        </span>
        <Link to="/compendium/items" className="text-[12px] font-medium">
          In the compendium
        </Link>
      </div>

      <div className="flex flex-shrink-0 flex-col gap-[3px]">
        <h2 className="font-display text-[27px] font-semibold leading-[1.05]">
          {item.name}
        </h2>
        <span className="text-[13.5px] italic text-foreground-2">
          {subtitle}
        </span>
      </div>

      {isGone(holding) ? (
        <div className="flex flex-shrink-0 items-center gap-2">
          <span
            className={cn(
              "rounded-full px-[9px] py-[3px] font-mono text-[11px]",
              STATUS_CHIP[holding.status],
            )}
          >
            {holding.status}
          </span>
          <button
            type="button"
            onClick={() => save({ status: "carried" }, true)}
            className="ml-auto min-h-[36px] rounded-[9px] border border-border-strong bg-secondary px-3 text-[13px] font-medium"
          >
            Bring it back
          </button>
        </div>
      ) : (
        <div className="flex flex-shrink-0 flex-col gap-[7px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
            Status
          </span>
          <div
            role="radiogroup"
            aria-label="Status"
            className="flex rounded-[9px] bg-rail p-[3px]"
          >
            {KEPT.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={holding.status === s}
                onClick={() => save({ status: s })}
                className={cn(
                  "min-h-[38px] flex-grow rounded-[7px] text-[13px]",
                  holding.status === s
                    ? "bg-proficiency font-semibold text-primary-foreground"
                    : "text-foreground-2",
                )}
              >
                {label(s)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid flex-shrink-0 grid-cols-2 gap-[9px]">
        <div className="flex flex-col gap-[2px] rounded-[10px] bg-secondary px-3 py-[10px]">
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
            Held by
          </span>
          <span className="text-[13.5px] font-semibold">
            {holding.holder_name ?? "Not placed"}
          </span>
        </div>
        <div className="flex items-center gap-[6px] rounded-[10px] bg-secondary px-3 py-[10px]">
          <span className="flex flex-grow flex-col gap-[2px]">
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              Quantity
            </span>
            <span className="font-mono text-[15px] font-semibold">
              {holding.quantity}
            </span>
          </span>
          <button
            type="button"
            aria-label="One fewer"
            disabled={holding.quantity <= 0}
            onClick={() => save({ quantity: holding.quantity - 1 })}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-border bg-card disabled:opacity-40"
          >
            <Minus className="h-[14px] w-[14px]" />
          </button>
          <button
            type="button"
            aria-label="One more"
            onClick={() => save({ quantity: holding.quantity + 1 })}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-border bg-card"
          >
            <Plus className="h-[14px] w-[14px]" />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-grow flex-col gap-3 overflow-y-auto pr-1">
        <div className="flex flex-col gap-[5px] rounded-[10px] border border-proficiency-soft bg-proficiency-soft px-[13px] py-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-proficiency-ink">
              Table notes
            </span>
            {editingNotes ? (
              <button
                type="button"
                onClick={() => {
                  save({ notes: notes || null }).then(() =>
                    setEditingNotes(false),
                  );
                }}
                className="ml-auto min-h-[28px] text-[12px] font-medium text-primary"
              >
                Save
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setEditingNotes(true)}
                className="ml-auto min-h-[28px] text-[12px] font-medium text-primary"
              >
                Edit
              </button>
            )}
          </div>
          {editingNotes ? (
            <>
              <label htmlFor="holding-notes" className="sr-only">
                Table notes
              </label>
              <textarea
                id="holding-notes"
                value={notes}
                rows={4}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-md border border-border bg-card p-2 text-[13.5px]"
              />
            </>
          ) : (
            <p className="whitespace-pre-line text-[13.5px] leading-[1.55]">
              {holding.notes || (
                <span className="text-muted-foreground">No notes yet.</span>
              )}
            </p>
          )}
        </div>
        {holding.description && (
          <p className="whitespace-pre-line text-[13.5px] leading-[1.6]">
            {holding.description}
          </p>
        )}
      </div>

      <div className="flex flex-shrink-0 flex-col gap-2 border-t border-hairline pt-3">
        <button
          type="button"
          onClick={() => onMove(holding)}
          className="min-h-[46px] rounded-[10px] bg-arcane text-[14px] font-semibold text-primary-foreground"
        >
          Move…
        </button>
        {!isGone(holding) && (
          <div className="flex gap-2">
            {(["sold", "lost"] as HoldingStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => save({ status: s }, true)}
                className="min-h-[44px] flex-grow rounded-[10px] border border-border-strong bg-secondary text-[13px] font-medium"
              >
                {s === "sold" ? "Sell" : "Lost"}
              </button>
            ))}
            <button
              type="button"
              onClick={() => save({ status: "destroyed" }, true)}
              className="min-h-[44px] flex-grow rounded-[10px] border border-harm-soft bg-harm-soft text-[13px] font-medium text-harm"
            >
              Destroyed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoldingDetail;
