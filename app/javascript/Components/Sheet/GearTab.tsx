import React, { useEffect, useState } from "react";
import { Client, ICharacterItemType, ICharacterType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";

interface GearTabProps {
  character: ICharacterType;
  patch: (
    updates: Partial<ICharacterType>,
    opts?: { debounce?: boolean },
  ) => void;
}

const COINS: { field: keyof ICharacterType; label: string }[] = [
  { field: "platinum", label: "PP" },
  { field: "gold", label: "GP" },
  { field: "electrum", label: "EP" },
  { field: "silver", label: "SP" },
  { field: "copper", label: "CP" },
];

const GearTab = ({ character, patch }: GearTabProps) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [items, setItems] = useState<ICharacterItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get({
        path: `/characters/${character.id}/items`,
        token: auth.getToken(),
      })
      .then((res) => setItems(res.data ?? []))
      .catch((err) => errors.setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [character.id]);

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-3 overflow-y-auto pr-1">
      {/* Coins */}
      <div className="flex flex-col gap-2 rounded-xl bg-secondary p-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
          Coin
        </span>
        <div className="grid grid-cols-5 gap-2">
          {COINS.map(({ field, label }) => (
            <label key={field} className="flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] font-semibold text-proficiency-ink">
                {label}
              </span>
              <input
                inputMode="numeric"
                value={(character[field] as number) ?? 0}
                onChange={(e) =>
                  patch({
                    [field]: Math.max(0, parseInt(e.target.value || "0", 10)),
                  } as Partial<ICharacterType>)
                }
                className="h-8 w-full rounded-md border border-border bg-card text-center font-mono text-[13px]"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Items */}
      {loading ? (
        <p className="py-6 text-center text-[13px] text-muted-foreground">
          Loading gear…
        </p>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-muted-foreground">
          No gear carried.
        </p>
      ) : (
        <div className="flex flex-col gap-[3px]">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-[9px] rounded-lg px-2 py-[8px] odd:bg-secondary"
            >
              <span className="min-w-0 flex-grow truncate text-[13px]">
                {item.name}
              </span>
              {item.requires_attunement && (
                <span className="rounded-full bg-proficiency-soft px-2 py-[2px] font-mono text-[9px] uppercase tracking-[0.08em] text-proficiency-ink">
                  Attune
                </span>
              )}
              <span className="font-mono text-[11px] text-muted-foreground">
                ×{item.quantity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GearTab;
