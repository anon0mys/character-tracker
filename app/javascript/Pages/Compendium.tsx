import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { ISpellType } from "../Api";
import { cn } from "../lib/utils";
import { Dialog, DialogContent } from "../Components/ui";
import SpellsTab from "../Components/Compendium/SpellsTab";
import ItemsTab from "../Components/Compendium/ItemsTab";
import DetailPane from "../Components/Compendium/DetailPane";
import { useIsDesktop } from "../Hooks/useIsDesktop";

const tabs = [
  { key: "spells", label: "Spells" },
  { key: "items", label: "Items" },
];

const Compendium = () => {
  const { tab } = useParams<{ tab: string }>();
  const active = tab === "items" ? "items" : "spells";
  const isDesktop = useIsDesktop();
  const [selected, setSelected] = useState<ISpellType | null>(null);

  return (
    <div className="flex min-h-[75vh] flex-col gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Compendium
        </h1>
        <p className="text-sm text-muted-foreground">
          Spells and items. Add anything here to a character&rsquo;s list.
        </p>
      </div>

      <div className="flex w-fit gap-[3px] rounded-[10px] border border-border bg-rail p-[3px]">
        {tabs.map(({ key, label }) => (
          <NavLink
            key={key}
            to={`/compendium/${key}`}
            onClick={() => setSelected(null)}
            className={cn(
              "flex min-h-[38px] items-center rounded-lg px-4 text-[13px] no-underline",
              active === key
                ? "bg-card font-semibold text-foreground"
                : "text-foreground-2",
            )}
          >
            {label}
          </NavLink>
        ))}
      </div>

      {active === "items" ? (
        <ItemsTab />
      ) : (
        <div className="flex min-h-0 flex-grow gap-4">
          <SpellsTab onSelect={setSelected} selectedId={selected?.id} />
          {selected && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <DetailPane spell={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      )}

      {/* Phone: detail as a dialog takeover */}
      {selected && !isDesktop && (
        <Dialog open onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DetailPane spell={selected} onClose={() => setSelected(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Compendium;
