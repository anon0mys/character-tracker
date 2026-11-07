import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Shield,
  PanelLeft,
  ChevronsUpDown,
  Users,
  BookOpen,
  Settings as SettingsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui";
import { useAuth } from "../../Auth";
import { useGame } from "../../Contexts";
import { Client, IGameType, ICharacterType } from "../../Api";
import { cn } from "../../lib/utils";
import initials from "./initials";
import UserProfile from "../User/UserProfile";

const RAIL_COLLAPSED_KEY = "railCollapsed";

const navItems = [
  { to: "/characters", label: "Party", Icon: Users },
  { to: "/compendium", label: "Compendium", Icon: BookOpen },
  { to: "/settings", label: "Settings", Icon: SettingsIcon },
];

const Rail = () => {
  const auth = useAuth();
  const { game, setCurrentGame } = useGame();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const client = Client();

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(RAIL_COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [games, setGames] = useState<IGameType[]>([]);
  const [characters, setCharacters] = useState<ICharacterType[]>([]);
  const [party, setParty] = useState<ICharacterType[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(RAIL_COLLAPSED_KEY, String(collapsed));
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  useEffect(() => {
    const token = auth.getToken();
    if (!token) return;
    client
      .get({ path: "/games", token })
      .then((res) => setGames(res.data ?? []))
      .catch(() => setGames([]));
    client
      .get({ path: "/characters", token })
      .then((res) => setCharacters(res.data ?? []))
      .catch(() => setCharacters([]));
    // Navigating refreshes the lists, so a character created or deleted
    // elsewhere doesn't linger here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, pathname]);

  useEffect(() => {
    const token = auth.getToken();
    if (!token || !game?.id) {
      setParty([]);
      return;
    }
    client
      .get({ path: `/characters?game_id=${game.id}`, token })
      .then((res) => setParty(res.data ?? []))
      .catch(() => setParty([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, game?.id, pathname]);

  // Only your characters in the campaign you're looking at.
  const mine = characters.filter((c) => c.game_id === game?.id);
  const current = mine.some((c) => Number(c.id) === auth.currentCharacter?.id)
    ? auth.currentCharacter
    : null;

  const switchCharacter = async (character: ICharacterType) => {
    if (!character.id) return;
    await auth.setCurrentCharacter(Number(character.id));
    navigate(`/characters/${character.id}`);
  };

  // Your own character becomes current; anyone else's opens read-only.
  const openPartyMember = (character: ICharacterType) =>
    character.user_id === auth.user?.id
      ? switchCharacter(character)
      : navigate(`/characters/${character.id}`);

  const brandMark = (
    <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[7px] bg-primary text-primary-foreground">
      <Shield className="h-4 w-4" />
    </span>
  );

  if (collapsed) {
    return (
      <nav
        aria-label="Main"
        className="sticky top-0 hidden h-screen w-[72px] flex-shrink-0 flex-col items-center gap-3 border-r border-border bg-rail px-3 py-4 lg:flex"
      >
        <NavLink to="/dashboard" aria-label="Campaigns">
          {brandMark}
        </NavLink>
        <button
          type="button"
          aria-label="Expand sidebar"
          onClick={() => setCollapsed(false)}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-card"
        >
          <PanelLeft className="h-[17px] w-[17px]" />
        </button>

        <div className="h-px w-6 bg-border" />

        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                "flex h-10 w-10 items-center justify-center rounded-[10px]",
                isActive
                  ? "bg-card text-primary"
                  : "text-muted-foreground hover:bg-card",
              )
            }
          >
            <Icon className="h-[17px] w-[17px]" />
          </NavLink>
        ))}

        {party.length > 0 && <div className="h-px w-6 bg-border" />}
        {party.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.name}
            onClick={() => openPartyMember(c)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full font-mono text-[8.5px] text-primary-foreground",
              current?.id === Number(c.id) ? "bg-proficiency" : "bg-arcane",
            )}
          >
            {initials(c.name)}
          </button>
        ))}

        <div className="mt-auto">
          <UserProfile collapsed />
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Main"
      className="sticky top-0 hidden h-screen w-[226px] flex-shrink-0 flex-col gap-[18px] border-r border-border bg-rail px-4 py-5 lg:flex"
    >
      {/* Brand */}
      <div className="flex items-center gap-[10px]">
        {brandMark}
        <NavLink
          to="/dashboard"
          className="flex-grow font-display text-[17px] font-semibold text-foreground no-underline"
        >
          Dungeon Tracker
        </NavLink>
        <button
          type="button"
          aria-label="Collapse sidebar"
          onClick={() => setCollapsed(true)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-card"
        >
          <PanelLeft className="h-[17px] w-[17px]" />
        </button>
      </div>

      {/* Campaign switcher */}
      <div className="flex flex-col gap-[7px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Campaign
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-h-[44px] items-center gap-2 rounded-[10px] border border-border-strong bg-card px-3 py-2 text-left text-sm font-medium text-foreground"
            >
              <span className="flex-grow truncate">
                {game?.name ?? "Select campaign"}
              </span>
              <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[196px]">
            <DropdownMenuLabel>Campaigns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {games.map((g) => (
              <DropdownMenuItem key={g.id} onClick={() => setCurrentGame(g)}>
                {g.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/dashboard")}>
              All campaigns…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Character switcher */}
      <div className="flex flex-col gap-[7px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          Character
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex min-h-[44px] items-center gap-[9px] rounded-[10px] border border-border-strong bg-secondary px-[10px] py-[7px] text-left"
            >
              <span className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-proficiency font-mono text-[10px] text-primary-foreground">
                {current ? initials(current.name) : "—"}
              </span>
              <span className="flex min-w-0 flex-grow flex-col">
                <span className="truncate text-[13.5px] font-semibold leading-tight">
                  {current?.name ?? "No character"}
                </span>
                {current && (
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {current.archetype} {current.level}
                  </span>
                )}
              </span>
              <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[196px]">
            <DropdownMenuLabel>Characters</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mine.map((c) => (
              <DropdownMenuItem key={c.id} onClick={() => switchCharacter(c)}>
                {c.name}
              </DropdownMenuItem>
            ))}
            {mine.length === 0 && (
              <DropdownMenuItem disabled>
                No characters in this campaign
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-[3px]">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex min-h-[44px] items-center gap-[11px] rounded-[9px] px-3 py-[10px] text-sm no-underline",
                isActive
                  ? "bg-card font-semibold text-primary"
                  : "text-foreground-2 hover:bg-card",
              )
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            {label}
          </NavLink>
        ))}
      </div>

      {/* Party */}
      {party.length > 0 && (
        <div className="flex flex-col gap-[5px] border-t border-border pt-[14px]">
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            The party
          </span>
          {party.map((c) => {
            const isCurrent = current?.id === Number(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => openPartyMember(c)}
                className="flex items-center gap-[9px] rounded-md px-1 py-[5px] text-left hover:bg-card"
              >
                <span
                  className={cn(
                    "flex h-[26px] w-[26px] items-center justify-center rounded-full font-mono text-[10px] text-primary-foreground",
                    isCurrent ? "bg-proficiency" : "bg-arcane",
                  )}
                >
                  {initials(c.name)}
                </span>
                <span
                  className={cn(
                    "flex-grow truncate text-[13px]",
                    isCurrent
                      ? "font-semibold text-foreground"
                      : "text-foreground-2",
                  )}
                >
                  {c.name}
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px]",
                    isCurrent ? "text-primary" : "text-foreground-2",
                  )}
                >
                  {c.current_hitpoints}/{c.total_hitpoints}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Account */}
      <div className="mt-auto flex items-center gap-[10px] border-t border-border pt-4">
        <UserProfile />
      </div>
    </nav>
  );
};

export default Rail;
