import { useEffect, useState } from "react";
import { cableFor } from "./cable";

const PING_MS = 10_000;
const STALE_MS = 25_000;

type Heard = Record<string, { entryId: number; name: string; at: number }>;

/** Names writing in each entry of a game, from editors' pings; stale names drop after 25s. */
const useJournalPresence = (
  gameId: number | undefined,
  token: string | null,
): Record<number, string[]> => {
  const [heard, setHeard] = useState<Heard>({});
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!gameId || !token) return;
    const subscription = cableFor(token).subscriptions.create(
      { channel: "JournalPresenceChannel", game_id: gameId },
      {
        received: (msg: any) =>
          setHeard((prev) => ({
            ...prev,
            [msg.user_id]: {
              entryId: msg.entry_id,
              name: msg.name,
              at: Date.now(),
            },
          })),
      },
    );
    const tick = setInterval(() => setNow(Date.now()), PING_MS);
    return () => {
      clearInterval(tick);
      subscription.unsubscribe();
    };
  }, [gameId, token]);

  return Object.values(heard)
    .filter(({ at }) => now - at < STALE_MS)
    .reduce<Record<number, string[]>>((byEntry, { entryId, name }) => {
      byEntry[entryId] = [...(byEntry[entryId] ?? []), name];
      return byEntry;
    }, {});
};

/** Tells the game's journal list that `name` is writing in this entry, every 10s. */
const useJournalPresencePing = (
  gameId: number | undefined,
  entryId: number,
  name: string,
  token: string | null,
) => {
  useEffect(() => {
    if (!gameId || !token) return;
    const subscription = cableFor(token).subscriptions.create(
      { channel: "JournalPresenceChannel", game_id: gameId },
      {
        connected: () =>
          subscription.perform("present", { entry_id: entryId, name }),
      },
    );
    const ping = setInterval(
      () => subscription.perform("present", { entry_id: entryId, name }),
      PING_MS,
    );
    return () => {
      clearInterval(ping);
      subscription.unsubscribe();
    };
  }, [gameId, entryId, name, token]);
};

export { useJournalPresence, useJournalPresencePing };
