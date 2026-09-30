import React from "react";
import { Client, ICharacterType, ILoadout } from "../../Api";
import { useAuth } from "../../Auth";
import { useError } from "../../Errors";
import { cn } from "../../lib/utils";

interface LoadoutBarProps {
  character: ICharacterType;
  onChange: (character: ICharacterType) => void;
}

// Hidden until a character has loadouts. Activating one re-fetches the
// character so derived AC/speed reflect it.
const LoadoutBar = ({ character, onChange }: LoadoutBarProps) => {
  const auth = useAuth();
  const client = Client();
  const errors = useError();
  const loadouts = character.loadouts ?? [];

  if (loadouts.length === 0) return null;

  const activate = (loadout: ILoadout) => {
    if (loadout.id === character.active_loadout_id) return;
    client
      .post({
        path: `/characters/${character.id}/loadouts/${loadout.id}/activate`,
        token: auth.getToken(),
      })
      .then(() =>
        client.get({
          path: `/characters/${character.id}`,
          token: auth.getToken(),
        }),
      )
      .then((r) => onChange(r.data))
      .catch((e) => errors.setError(e));
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border-strong bg-proficiency-soft px-4 py-[10px]">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-proficiency-ink">
          Loadout
        </span>
        <span className="text-[11px] text-foreground-2">
          Swaps AC, speed &amp; attacks
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {loadouts.map((loadout) => {
          const active = loadout.id === character.active_loadout_id;
          return (
            <button
              key={loadout.id}
              type="button"
              onClick={() => activate(loadout)}
              className={cn(
                "flex min-h-[44px] flex-col items-start rounded-[11px] border px-4 py-[7px] text-left",
                active
                  ? "border-proficiency-ink bg-proficiency text-primary-foreground"
                  : "border-border bg-card text-foreground-2",
              )}
            >
              <span className="text-[14px] font-semibold">{loadout.name}</span>
              {loadout.modifiers?.notes && (
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    active
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {loadout.modifiers.notes}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LoadoutBar;
