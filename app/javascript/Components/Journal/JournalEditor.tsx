import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EditorContent, useEditor, Editor, JSONContent } from "@tiptap/react";
import { Range } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import { Awareness } from "y-protocols/awareness";
import { Bold, Heading3, Italic, List } from "lucide-react";
import { IItemType, IMentionRef } from "../../Api";
import { ItemForm } from "../Items";
import { cn } from "../../lib/utils";
import { SyncedDoc } from "./useJournalSync";
import {
  journalMentions,
  hrefFor,
  MENTION_NODES,
  MentionContext,
  THING,
} from "./mentions";

interface JournalEditorProps {
  synced: SyncedDoc;
  gameId: number;
  token: string | null;
  user: { name: string; color: string };
  onLinksChange: (links: IMentionRef[]) => void;
}

/**
 * What CollaborationCursor reads cursors from. A class, not `{ awareness }`:
 * TipTap 2.1's configure() deep-merges plain objects into the `provider: null`
 * default and drops their keys.
 */
class CursorProvider {
  constructor(readonly awareness: Awareness) {}
}

/** Every distinct @/# link in the body, in reading order. */
const linksIn = (json: JSONContent): IMentionRef[] => {
  const found: IMentionRef[] = [];
  const walk = (node: JSONContent) => {
    if (MENTION_NODES.includes(node.type ?? "") && node.attrs) {
      const { id, type, label } = node.attrs;
      if (!found.some((l) => l.type === type && l.id === id))
        found.push({ id, type, label });
    }
    node.content?.forEach(walk);
  };
  walk(json);
  return found;
};

const toolButton =
  "flex h-9 min-w-[36px] items-center justify-center rounded-[7px] text-foreground-2 hover:bg-card";

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="hidden items-center gap-1 rounded-[10px] border border-border bg-secondary p-[5px] lg:flex">
    <button
      type="button"
      aria-label="Bold"
      className={cn(toolButton, editor.isActive("bold") && "bg-card")}
      onClick={() => editor.chain().focus().toggleBold().run()}
    >
      <Bold className="h-4 w-4" />
    </button>
    <button
      type="button"
      aria-label="Italic"
      className={cn(toolButton, editor.isActive("italic") && "bg-card")}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    >
      <Italic className="h-4 w-4" />
    </button>
    <button
      type="button"
      aria-label="Heading"
      className={cn(toolButton, editor.isActive("heading") && "bg-card")}
      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
    >
      <Heading3 className="h-4 w-4" />
    </button>
    <button
      type="button"
      aria-label="Bulleted list"
      className={cn(toolButton, editor.isActive("bulletList") && "bg-card")}
      onClick={() => editor.chain().focus().toggleBulletList().run()}
    >
      <List className="h-4 w-4" />
    </button>
    <span className="mx-[6px] h-[22px] w-px bg-border" />
    <button
      type="button"
      className="min-h-9 rounded-[7px] bg-arcane-soft px-[11px] py-[6px] font-mono text-[13px] font-semibold text-arcane-ink"
      onClick={() => editor.chain().focus().insertContent("@").run()}
    >
      @ person
    </button>
    <button
      type="button"
      className="min-h-9 rounded-[7px] bg-proficiency-soft px-[11px] py-[6px] font-mono text-[13px] font-semibold text-proficiency-ink"
      onClick={() => editor.chain().focus().insertContent("#").run()}
    >
      # thing
    </button>
  </div>
);

/** On a phone: @ and # without hunting the keyboard, plus Done to drop it. */
const AccessoryBar = ({ editor }: { editor: Editor }) => (
  <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-[6px] border-t border-border bg-rail px-2 pb-[14px] pt-[6px] lg:hidden">
    <button
      type="button"
      className="min-h-11 min-w-12 rounded-[10px] bg-arcane-soft font-mono text-[17px] font-semibold text-arcane-ink"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => editor.chain().focus().insertContent("@").run()}
    >
      @
    </button>
    <button
      type="button"
      className="min-h-11 min-w-12 rounded-[10px] bg-proficiency-soft font-mono text-[17px] font-semibold text-proficiency-ink"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => editor.chain().focus().insertContent("#").run()}
    >
      #
    </button>
    <span className="mx-1 h-6 w-px bg-border" />
    <button
      type="button"
      aria-label="Bold"
      className="h-11 w-11 rounded-[10px] text-foreground-2"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => editor.chain().focus().toggleBold().run()}
    >
      <Bold className="mx-auto h-4 w-4" />
    </button>
    <button
      type="button"
      aria-label="Italic"
      className="h-11 w-11 rounded-[10px] text-foreground-2"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => editor.chain().focus().toggleItalic().run()}
    >
      <Italic className="mx-auto h-4 w-4" />
    </button>
    <button
      type="button"
      className="ml-auto min-h-11 rounded-[10px] px-3 text-[14px] font-semibold text-primary"
      onClick={() => editor.commands.blur()}
    >
      Done
    </button>
  </div>
);

const JournalEditor = ({
  synced,
  gameId,
  token,
  user,
  onLinksChange,
}: JournalEditorProps) => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState<{
    name: string;
    range: Range;
  } | null>(null);
  const [focused, setFocused] = useState(false);
  const ctxRef = useRef<MentionContext>({
    gameId,
    token,
    onCreateItem: (name, range) => setCreating({ name, range }),
  });
  ctxRef.current = { ...ctxRef.current, gameId, token };

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({ history: false }),
        Collaboration.configure({ document: synced.doc }),
        CollaborationCursor.configure({
          provider: new CursorProvider(synced.awareness),
          user,
        }),
        ...journalMentions(ctxRef),
      ],
      editorProps: {
        attributes: {
          class:
            "min-h-[320px] max-w-[760px] text-[16px] leading-[1.75] text-foreground outline-none [&_h3]:font-display [&_h3]:text-[20px] [&_h3]:font-semibold [&_p+p]:mt-[14px] [&_ul]:list-disc [&_ul]:pl-6",
        },
        handleClickOn: (_view, _pos, node) => {
          if (!MENTION_NODES.includes(node.type.name)) return false;
          navigate(hrefFor({ type: node.attrs.type, id: node.attrs.id }));
          return true;
        },
      },
      onCreate: ({ editor }) => onLinksChange(linksIn(editor.getJSON())),
      onUpdate: ({ editor }) => onLinksChange(linksIn(editor.getJSON())),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
    },
    [synced.doc],
  );

  useEffect(() => {
    editor?.commands.updateUser(user);
  }, [editor, user.name, user.color]);

  const linkCreatedItem = (item: IItemType) => {
    if (!editor || !creating || !item.id) return;
    editor
      .chain()
      .focus()
      .insertContentAt(creating.range, [
        { type: THING, attrs: { id: item.id, type: "Item", label: item.name } },
        { type: "text", text: " " },
      ])
      .run();
    setCreating(null);
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-4">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      {focused && <AccessoryBar editor={editor} />}
      {creating && (
        <ItemForm
          open
          initialName={creating.name}
          close={() => setCreating(null)}
          onSaved={linkCreatedItem}
        />
      )}
    </div>
  );
};

export default JournalEditor;
