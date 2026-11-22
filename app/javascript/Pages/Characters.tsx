import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Components/ui";
import { useAuth } from "../Auth";
import { useGame } from "../Contexts";
import { useError } from "../Errors";
import { Client, ICharacterType } from "../Api";
import { CharacterCard } from "../Components/Characters";
import { initials } from "../Components/Shell";
import { cn } from "../lib/utils";

/**
 * The current campaign's party: everyone's characters, yours marked, each
 * opening its sheet (read-only when it isn't yours). Below, your characters in
 * other campaigns. A DM with no character of their own still sees the party.
 */
const Characters = () => {
  const auth = useAuth();
  const { game } = useGame();
  const client = Client();
  const errors = useError();
  const [party, setParty] = useState<ICharacterType[]>([]);
  const [mine, setMine] = useState<ICharacterType[]>([]);
  const token = auth.getToken();

  const load = () => {
    if (game?.id)
      client
        .get({ path: `/characters?game_id=${game.id}`, token })
        .then((r) => setParty(r.data ?? []))
        .catch((e) => errors.setError(e));
    client
      .get({ path: "/characters", token })
      .then((r) => setMine(r.data ?? []))
      .catch((e) => errors.setError(e));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.id]);

  const elsewhere = mine.filter((c) => c.game_id !== game?.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Party
          </h1>
          <p className="text-sm text-muted-foreground">
            {game?.name
              ? `Everyone adventuring in ${game.name}.`
              : "Your characters."}
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="min-h-[44px] w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
        >
          <Link to="/characters/create">Create character</Link>
        </Button>
      </div>

      {game?.id && party.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {party.map((c) => {
            const yours = c.user_id === auth.user?.id;
            return (
              <li key={c.id}>
                <Link
                  to={`/characters/${c.id}`}
                  className={cn(
                    "flex min-h-[72px] items-center gap-3 rounded-[14px] border bg-card px-4 py-3 text-foreground hover:border-border-strong",
                    yours ? "border-border-strong" : "border-border",
                  )}
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-arcane font-mono text-[12px] text-primary-foreground">
                    {initials(c.name)}
                  </span>
                  <span className="flex min-w-0 flex-grow flex-col">
                    <span className="truncate font-display text-[17px] font-semibold">
                      {c.name}
                    </span>
                    <span className="truncate font-mono text-[11.5px] text-muted-foreground">
                      {c.archetype} {c.level}
                      {yours ? " · you" : c.player ? ` · ${c.player}` : ""}
                    </span>
                  </span>
                  <span className="font-mono text-[13px] text-foreground-2">
                    {c.current_hitpoints}/{c.total_hitpoints}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {game?.id && party.length === 0 && (
        <div className="rounded-[14px] border border-dashed border-border-strong p-8 text-center">
          <p className="font-display text-lg font-semibold">
            No one in this party yet
          </p>
          <p className="mt-1 text-[14px] text-foreground-2">
            Invite your players from Members on the campaign page, or create a
            character.
          </p>
        </div>
      )}

      {elsewhere.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl font-semibold">
            {game?.id
              ? "Your characters in other campaigns"
              : "Your characters"}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {elsewhere.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                deleteCharacter={load}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Characters;
