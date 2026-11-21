// Turns TipTap JSON bodies into the Yjs state the journal editor loads.
//
// Reads a JSON array of TipTap docs on stdin and writes a JSON array of
// base64 Yjs updates (one per doc, in order) on stdout. Used by imports that
// write journal entries from the server; see JournalEntry#ydoc_state.
//
// The schema must match the editor's (JournalEditor.tsx: StarterKit + the
// two mention nodes in mentions.ts), and the fragment name must match
// TipTap's Collaboration default ("default"), or the editor opens blank.
import { getSchema } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import { prosemirrorJSONToYDoc } from "y-prosemirror";
import * as Y from "yjs";

const mentionNode = (name) =>
  Mention.extend({
    name,
    addAttributes: () => ({
      id: { default: null },
      type: { default: null },
      label: { default: null },
    }),
  });

const schema = getSchema([
  StarterKit.configure({ history: false }),
  mentionNode("personMention"),
  mentionNode("thingMention"),
]);

const read = async () => {
  let input = "";
  for await (const chunk of process.stdin) input += chunk;
  return JSON.parse(input);
};

const bodies = await read();
const states = bodies.map((body) => {
  schema.nodeFromJSON(body).check(); // throws on a body the editor can't hold
  const doc = prosemirrorJSONToYDoc(schema, body, "default");
  return Buffer.from(Y.encodeStateAsUpdate(doc)).toString("base64");
});
process.stdout.write(JSON.stringify(states));
