import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  Sword,
  Sparkles,
  Boxes,
  BookOpen,
  Settings as SettingsIcon,
  Home,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface Tab {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

// Returns the character id when the current path is a specific character
// screen (/characters/:id...), else null. "create" is not a character.
const characterIdFromPath = (pathname: string): string | null => {
  const match = pathname.match(/^\/characters\/([^/]+)/);
  if (!match) return null;
  if (match[1] === "create") return null;
  return match[1];
};

const globalTabs: Tab[] = [
  { to: "/dashboard", label: "Campaigns", Icon: Home },
  { to: "/compendium", label: "Compendium", Icon: BookOpen },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
];

// Sheet sub-tabs (Attacks/Spells/Gear) land on the sheet until Phase 2/4
// splits them out; Sheet and Features are real routes today.
const characterTabs = (id: string): Tab[] => [
  { to: `/characters/${id}`, label: "Sheet", Icon: Users, end: true },
  { to: `/characters/${id}`, label: "Attacks", Icon: Sword },
  { to: `/characters/${id}`, label: "Spells", Icon: Sparkles },
  { to: `/characters/${id}`, label: "Gear", Icon: Boxes },
  { to: `/characters/${id}/features`, label: "Features", Icon: BookOpen },
];

const BottomTabs = () => {
  const { pathname } = useLocation();
  const characterId = characterIdFromPath(pathname);
  const tabs = characterId ? characterTabs(characterId) : globalTabs;

  return (
    <nav
      aria-label="Sections"
      className="flex flex-shrink-0 items-center border-t border-border bg-rail px-[2px] pb-[14px] pt-[6px] lg:hidden"
      style={{ paddingBottom: "calc(14px + env(safe-area-inset-bottom, 0px))" }}
    >
      {tabs.map(({ to, label, Icon, end }, i) => (
        <NavLink
          key={`${to}-${i}`}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(
              "flex min-h-[48px] flex-grow flex-col items-center justify-center gap-[3px] rounded-[10px] no-underline",
              isActive ? "text-primary" : "text-foreground-2",
            )
          }
        >
          <Icon className="h-[19px] w-[19px]" />
          <span className="text-[9.5px] font-semibold">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomTabs;
