import React, { useEffect, useState } from "react";
import { Client, ICharacterTrackerType, ResetOn } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/utils";
import { clamp } from "./format";
import TrackerForm from "../Characters/Trackers/TrackerForm";

// 4b: resources are the existing character_trackers. Small pools render as
// pips; larger ones as +/- steppers. Add creates a new tracker.
const PIP_LIMIT = 8;

const ConsumablesTab = ({ characterId }: { characterId: string | number }) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [trackers, setTrackers] = useState<ICharacterTrackerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    client
      .get({
        path: `/characters/${characterId}/trackers`,
        token: auth.getToken(),
      })
      .then((res) => setTrackers(res.data ?? []))
      .catch((err) => errors.setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  const setUses = (tracker: ICharacterTrackerType, next: number) => {
    const current_uses = clamp(next, 0, tracker.max_uses);
    setTrackers((prev) =>
      prev.map((t) => (t.id === tracker.id ? { ...t, current_uses } : t)),
    );
    client
      .patch({
        path: `/characters/${characterId}/trackers/${tracker.id}`,
        payload: { character_tracker: { current_uses } },
        token: auth.getToken(),
        showSuccessToast: false,
      })
      .catch((err) => errors.setError(err));
  };

  const create = (values: {
    name: string;
    max_uses: number;
    reset_on: ResetOn;
    category?: string;
    description?: string;
  }) => {
    client
      .post({
        path: `/characters/${characterId}/trackers`,
        payload: {
          character_tracker: { ...values, current_uses: values.max_uses },
        },
        token: auth.getToken(),
      })
      .then((res) => {
        setTrackers((prev) => [...prev, res.data]);
        setFormOpen(false);
      })
      .catch((err) => errors.setError(err));
  };

  const header = (
    <div className="flex items-center">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        Consumables
      </span>
      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="ml-auto min-h-[30px] rounded-full border border-border-strong px-3 text-[11px]"
      >
        Add
      </button>
    </div>
  );

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3 overflow-y-auto pr-1">
      {header}
      {loading ? (
        <p className="py-6 text-center text-[13px] text-muted-foreground">
          Loading…
        </p>
      ) : trackers.length === 0 ? (
        <div className="flex flex-col items-center gap-1 py-8 text-center">
          <p className="text-[13px] font-medium text-foreground-2">
            No consumables yet
          </p>
          <p className="text-[12px] text-muted-foreground">
            Add a resource to track pips or charges.
          </p>
        </div>
      ) : (
        trackers.map((tracker) => (
          <div
            key={tracker.id}
            className="flex flex-col gap-[6px] rounded-lg bg-secondary p-[10px]"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-[13px] font-medium">{tracker.name}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {tracker.current_uses}/{tracker.max_uses}
              </span>
              {tracker.reset_on && tracker.reset_on !== "never" && (
                <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground">
                  {tracker.reset_on.replace("_", " ")}
                </span>
              )}
            </div>
            {tracker.max_uses <= PIP_LIMIT ? (
              <div className="flex flex-wrap gap-[5px]">
                {Array.from({ length: tracker.max_uses }).map((_, i) => {
                  const filled = i < tracker.current_uses;
                  const next = i + 1 === tracker.current_uses ? i : i + 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`${tracker.name} ${i + 1}`}
                      onClick={() => setUses(tracker, next)}
                      className={cn(
                        "h-[22px] w-[22px] rounded-[6px] border transition-colors",
                        filled
                          ? "border-arcane bg-arcane"
                          : "border-border-strong bg-background",
                      )}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Spend one"
                  onClick={() => setUses(tracker, tracker.current_uses - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-mono text-[15px]">
                  {tracker.current_uses}
                </span>
                <button
                  type="button"
                  aria-label="Restore one"
                  onClick={() => setUses(tracker, tracker.current_uses + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-strong"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ))
      )}
      <TrackerForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={create}
      />
    </div>
  );
};

export default ConsumablesTab;
