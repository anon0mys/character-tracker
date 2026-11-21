import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGame } from "../../Contexts";

interface Crumb {
  label: string;
  to: string;
}

/** Names the URL can't tell us (a character's name, an entry's title), by path. */
type Labels = Record<string, string>;

const BreadcrumbContext = createContext<{
  labels: Labels;
  setLabel: (path: string, label: string) => void;
}>({ labels: {}, setLabel: () => undefined });

const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const [labels, setLabels] = useState<Labels>({});
  const setLabel = (path: string, label: string) =>
    setLabels((current) =>
      current[path] === label ? current : { ...current, [path]: label },
    );
  return (
    <BreadcrumbContext.Provider value={{ labels, setLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

/**
 * Tells the breadcrumbs what to call the page at `path`, e.g. a character
 * page publishing the character's name. Ignored until both are known.
 */
const useBreadcrumbLabel = (path?: string, label?: string | null) => {
  const { setLabel } = useContext(BreadcrumbContext);
  useEffect(() => {
    if (path && label) setLabel(path, label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, label]);
};

const CHARACTER_PAGES: Record<string, string> = {
  edit: "Edit",
  features: "Features",
  notes: "Notes",
  attacks: "Attacks",
  spells: "Spells",
  gear: "Gear",
};

/**
 * Where a path sits in the app, from the top down; the last crumb is the page
 * itself. Top-level pages (Campaigns, Compendium, Settings) are a single crumb.
 */
const crumbsFor = (
  pathname: string,
  game: { id?: number; name?: string } | null,
  labels: Labels,
): Crumb[] => {
  const campaigns: Crumb = { label: "Campaigns", to: "/dashboard" };
  const campaign = (id: number | undefined): Crumb[] =>
    id
      ? [
          campaigns,
          {
            label:
              labels[`/campaigns/${id}`] ??
              (game?.id === id ? game.name : null) ??
              "Campaign",
            to: `/campaigns/${id}`,
          },
        ]
      : [campaigns];
  const parts = pathname.split("/").filter(Boolean);

  switch (parts[0]) {
    case "campaigns": {
      const trail = campaign(Number(parts[1]));
      if (parts[2] === "journal" && parts[3])
        trail.push({
          label: labels[pathname] ?? "Journal entry",
          to: pathname,
        });
      return trail;
    }
    case "characters": {
      const trail = campaign(game?.id);
      if (!parts[1]) return [...trail, { label: "Party", to: "/characters" }];
      if (parts[1] === "create")
        return [
          ...trail,
          { label: "Party", to: "/characters" },
          { label: "New character", to: pathname },
        ];
      const sheet = `/characters/${parts[1]}`;
      trail.push({ label: labels[sheet] ?? "Character", to: sheet });
      if (parts[2] && CHARACTER_PAGES[parts[2]])
        trail.push({ label: CHARACTER_PAGES[parts[2]], to: pathname });
      return trail;
    }
    case "compendium":
      return [{ label: "Compendium", to: pathname }];
    case "settings":
      return [{ label: "Settings", to: "/settings" }];
    case "join":
      return [campaigns, { label: "Join a campaign", to: pathname }];
    default:
      return [campaigns];
  }
};

/** The breadcrumb trail for the current page. */
const useBreadcrumbs = (): Crumb[] => {
  const { pathname } = useLocation();
  const { game } = useGame();
  const { labels } = useContext(BreadcrumbContext);
  return crumbsFor(pathname, game, labels);
};

export { BreadcrumbProvider, crumbsFor, useBreadcrumbLabel, useBreadcrumbs };
export type { Crumb };
