import React, { useEffect, useState } from "react";
import { Client, ICharacterItemType } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";

const GearTab = ({ characterId }: { characterId: string | number }) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const [items, setItems] = useState<ICharacterItemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get({ path: `/characters/${characterId}/items`, token: auth.getToken() })
      .then((res) => setItems(res.data ?? []))
      .catch((err) => errors.setError(err))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId]);

  if (loading) {
    return (
      <p className="py-6 text-center text-[13px] text-muted-foreground">
        Loading gear…
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="py-6 text-center text-[13px] text-muted-foreground">
        No gear carried.
      </p>
    );
  }

  return (
    <div className="flex min-h-0 flex-grow flex-col gap-[3px] overflow-y-auto pr-1">
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
  );
};

export default GearTab;
