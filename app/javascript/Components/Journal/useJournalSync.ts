import { useEffect, useState } from "react";
import * as Y from "yjs";
import { yXmlFragmentToProsemirrorJSON } from "y-prosemirror";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";
import { cableFor, fromBase64, toBase64 } from "./cable";

const REMOTE = "remote";
const SNAPSHOT_DEBOUNCE_MS = 2000;

type SyncStatus = "connecting" | "live" | "offline";

interface SyncedDoc {
  doc: Y.Doc;
  awareness: Awareness;
}

/**
 * Binds a fresh Y.Doc to JournalEntryChannel and returns it once the server's
 * state has been applied. The server logs every update with a per-entry seq;
 * this client posts a snapshot 2s after it edits, covering every seq up to its
 * contiguous watermark, so the server can drop those log rows.
 */
const useJournalSync = (entryId: number, token: string | null) => {
  const [synced, setSynced] = useState<SyncedDoc | null>(null);
  const [status, setStatus] = useState<SyncStatus>("connecting");

  useEffect(() => {
    if (!token) return;
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const clientId = `${doc.clientID}-${Math.random().toString(36).slice(2)}`;
    const seen = new Set<number>();
    const knownPeers = new Set<string>();
    let watermark = 0;
    let snapshotTimer: ReturnType<typeof setTimeout> | undefined;

    const markSeen = (seq: number) => {
      seen.add(seq);
      while (seen.has(watermark + 1)) seen.delete(++watermark);
    };

    const subscription = cableFor(token).subscriptions.create(
      { channel: "JournalEntryChannel", entry_id: entryId },
      {
        connected: () => setStatus("live"),
        disconnected: () => setStatus("offline"),
        rejected: () => setStatus("offline"),
        received: (msg: any) => {
          if (msg.type === "init") {
            if (msg.state) Y.applyUpdate(doc, fromBase64(msg.state), REMOTE);
            watermark = Math.max(watermark, msg.compacted_through);
            msg.updates.forEach(([seq, update]: [number, string]) => {
              Y.applyUpdate(doc, fromBase64(update), REMOTE);
              markSeen(seq);
            });
            setSynced({ doc, awareness });
            sendAwareness();
          } else if (msg.type === "update") {
            if (msg.from !== clientId)
              Y.applyUpdate(doc, fromBase64(msg.update), REMOTE);
            markSeen(msg.seq);
          } else if (msg.type === "awareness" && msg.from !== clientId) {
            applyAwarenessUpdate(awareness, fromBase64(msg.update), REMOTE);
            if (!knownPeers.has(msg.from)) {
              knownPeers.add(msg.from);
              sendAwareness();
            }
          }
        },
      },
    );

    const sendAwareness = () =>
      subscription.perform("awareness", {
        update: toBase64(encodeAwarenessUpdate(awareness, [doc.clientID])),
        from: clientId,
      });

    const snapshotNow = () => {
      clearTimeout(snapshotTimer);
      snapshotTimer = undefined;
      subscription.perform("snapshot", {
        state: toBase64(Y.encodeStateAsUpdate(doc)),
        body: yXmlFragmentToProsemirrorJSON(doc.getXmlFragment("default")),
        through_seq: watermark,
      });
    };

    const onDocUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === REMOTE) return;
      subscription.perform("update", {
        update: toBase64(update),
        from: clientId,
      });
      clearTimeout(snapshotTimer);
      snapshotTimer = setTimeout(snapshotNow, SNAPSHOT_DEBOUNCE_MS);
    };

    const onAwarenessUpdate = (_changes: unknown, origin: unknown) => {
      if (origin !== REMOTE) sendAwareness();
    };

    const flushOnHide = () => snapshotTimer && snapshotNow();

    doc.on("update", onDocUpdate);
    awareness.on("update", onAwarenessUpdate);
    window.addEventListener("pagehide", flushOnHide);

    return () => {
      window.removeEventListener("pagehide", flushOnHide);
      if (snapshotTimer) snapshotNow();
      removeAwarenessStates(awareness, [doc.clientID], "local");
      doc.off("update", onDocUpdate);
      awareness.off("update", onAwarenessUpdate);
      subscription.unsubscribe();
      setSynced(null);
      setStatus("connecting");
      awareness.destroy();
      doc.destroy();
    };
  }, [entryId, token]);

  return { synced, status };
};

export default useJournalSync;
export type { SyncStatus, SyncedDoc };
