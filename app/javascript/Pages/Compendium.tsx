import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { cn } from "../lib/utils";
import Spells from "./Spells";
import Items from "./Items";

const tabs = [
  { key: "spells", label: "Spells" },
  { key: "items", label: "Items" },
];

// Compendium shell: one segmented control over the existing Spells and
// Items browsers. The board's richer table/detail-pane is a later refinement;
// Phase 1 mounts the existing bodies (each keeps its own filters + forms).
const Compendium = () => {
  const { tab } = useParams<{ tab: string }>();
  const active = tab === "items" ? "items" : "spells";

  return (
    <div className="flex flex-col gap-5">
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

      {active === "items" ? <Items /> : <Spells />}
    </div>
  );
};

export default Compendium;
