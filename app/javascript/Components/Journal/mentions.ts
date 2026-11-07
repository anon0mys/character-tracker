import { ReactRenderer } from "@tiptap/react";
import Mention from "@tiptap/extension-mention";
import { PluginKey } from "@tiptap/pm/state";
import { Range } from "@tiptap/core";
import { Client, IMentionRef, IMentionResult } from "../../Api";
import MentionList, { MentionKind, MentionListHandle } from "./MentionList";

const PERSON = "personMention";
const THING = "thingMention";
const MENTION_NODES = [PERSON, THING];

const PEOPLE_CHIP =
  "rounded-[6px] bg-arcane-soft px-[6px] py-[1px] font-medium text-arcane-ink cursor-pointer hover:underline";
const THING_CHIP =
  "rounded-[6px] bg-proficiency-soft px-[6px] py-[1px] font-medium text-proficiency-ink cursor-pointer hover:underline";

const COMPENDIUM_TAB: Record<string, string> = {
  Item: "items",
  Monster: "monsters",
  Spell: "spells",
};

/** Where a chip leads: the character sheet, or the Compendium entry's detail pane. */
const hrefFor = ({ type, id }: Pick<IMentionRef, "type" | "id">) =>
  type === "Character"
    ? `/characters/${id}`
    : `/compendium/${COMPENDIUM_TAB[type]}?id=${id}`;

interface MentionContext {
  gameId: number;
  token: string | null;
  onCreateItem: (name: string, range: Range) => void;
}

/** The context is read through a ref so the editor never rebuilds when it changes. */
type ContextRef = { current: MentionContext };

const fetchResults = async (
  ctx: MentionContext,
  kind: MentionKind,
  query: string,
): Promise<IMentionResult[]> => {
  const params = new URLSearchParams({ kind, q: query });
  const response = await Client().get({
    path: `/games/${ctx.gameId}/mentions?${params}`,
    token: ctx.token,
  });
  return response?.data ?? [];
};

/** Floats the typeahead under the caret; on a phone it sits above the accessory bar. */
const placePopover = (el: HTMLElement, rect: DOMRect | null | undefined) => {
  el.style.position = "fixed";
  el.style.zIndex = "60";
  if (window.innerWidth < 1024) {
    Object.assign(el.style, {
      left: "10px",
      right: "10px",
      top: "",
      bottom: "72px",
    });
  } else if (rect) {
    Object.assign(el.style, {
      left: `${rect.left}px`,
      top: `${rect.bottom + 8}px`,
      right: "",
      bottom: "",
    });
  }
};

const suggestionRender = (kind: MentionKind, ctxRef: ContextRef) => () => {
  let renderer: ReactRenderer<MentionListHandle> | null = null;

  const propsFor = (props: any) => ({
    kind,
    query: props.query,
    items: props.items,
    command: (item: IMentionResult) =>
      props.command({ id: item.id, type: item.type, label: item.label }),
    onCreate: () => {
      if (renderer) (renderer.element as HTMLElement).style.display = "none";
      ctxRef.current.onCreateItem(props.query, props.range);
    },
  });

  return {
    onStart: (props: any) => {
      renderer = new ReactRenderer(MentionList, {
        props: propsFor(props),
        editor: props.editor,
      });
      document.body.appendChild(renderer.element);
      placePopover(renderer.element as HTMLElement, props.clientRect?.());
    },
    onUpdate: (props: any) => {
      renderer?.updateProps(propsFor(props));
      if (renderer)
        placePopover(renderer.element as HTMLElement, props.clientRect?.());
    },
    onKeyDown: (props: any) => {
      if (props.event.key === "Escape") return false;
      return renderer?.ref?.onKeyDown(props.event) ?? false;
    },
    onExit: () => {
      renderer?.element.remove();
      renderer?.destroy();
      renderer = null;
    },
  };
};

const mentionNode = (
  name: string,
  char: string,
  kind: MentionKind,
  chip: string,
  ctxRef: ContextRef,
) =>
  Mention.extend({
    name,
    addAttributes() {
      return {
        id: {
          default: null,
          parseHTML: (el: HTMLElement) => Number(el.getAttribute("data-id")),
          renderHTML: (attrs: Record<string, any>) => ({ "data-id": attrs.id }),
        },
        type: {
          default: null,
          parseHTML: (el: HTMLElement) =>
            el.getAttribute("data-mentionable-type"),
          renderHTML: (attrs: Record<string, any>) => ({
            "data-mentionable-type": attrs.type,
          }),
        },
        label: {
          default: null,
          parseHTML: (el: HTMLElement) => el.getAttribute("data-label"),
          renderHTML: (attrs: Record<string, any>) => ({
            "data-label": attrs.label,
          }),
        },
      };
    },
  }).configure({
    HTMLAttributes: { class: chip },
    suggestion: {
      char,
      // Names have spaces ("Wand of Wonder"); Escape or a pick closes it.
      allowSpaces: true,
      pluginKey: new PluginKey(name),
      items: ({ query }: { query: string }) =>
        fetchResults(ctxRef.current, kind, query),
      render: suggestionRender(kind, ctxRef),
    },
  });

const journalMentions = (ctxRef: ContextRef) => [
  mentionNode(PERSON, "@", "people", PEOPLE_CHIP, ctxRef),
  mentionNode(THING, "#", "things", THING_CHIP, ctxRef),
];

export {
  journalMentions,
  hrefFor,
  MENTION_NODES,
  PERSON,
  THING,
  PEOPLE_CHIP,
  THING_CHIP,
};
export type { MentionContext };
