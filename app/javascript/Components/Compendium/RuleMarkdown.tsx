import React from "react";

/**
 * Renders the small markdown dialect the SRD rules text uses: ## to #####
 * headings, paragraphs, - and 1. lists, | tables |, and *em* / **strong** /
 * ***both***. Everything is rendered as React text, never as raw HTML.
 */

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; header: string[]; rows: string[][] };

const HEADING = /^(#{2,5})\s+(.*)$/;
const BULLET = /^\s*[-*]\s+(.*)$/;
const NUMBERED = /^\s*\d+\.\s+(.*)$/;
const TABLE_ROW = /^\s*\|/;
const TABLE_RULE = /^\s*\|?\s*:?-{2,}/;

const cells = (line: string) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());

const parse = (source: string): Block[] => {
  const lines = source.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const heading = line.match(HEADING);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length,
        text: heading[2],
      });
      i++;
    } else if (TABLE_ROW.test(line)) {
      const rows: string[][] = [];
      while (i < lines.length && TABLE_ROW.test(lines[i])) {
        if (!TABLE_RULE.test(lines[i])) rows.push(cells(lines[i]));
        i++;
      }
      blocks.push({
        kind: "table",
        header: rows[0] ?? [],
        rows: rows.slice(1),
      });
    } else if (BULLET.test(line) || NUMBERED.test(line)) {
      const ordered = NUMBERED.test(line);
      const pattern = ordered ? NUMBERED : BULLET;
      const items: string[] = [];
      // Items may be separated by blank lines; they're still one list.
      while (i < lines.length) {
        const m = lines[i].match(pattern);
        if (m) {
          items.push(m[1]);
          i++;
        } else if (!lines[i].trim() && lines[i + 1]?.match(pattern)) i++;
        else break;
      }
      blocks.push({ kind: "list", ordered, items });
    } else {
      const text: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() &&
        !HEADING.test(lines[i]) &&
        !TABLE_ROW.test(lines[i]) &&
        !BULLET.test(lines[i]) &&
        !NUMBERED.test(lines[i])
      )
        text.push(lines[i++].trim());
      blocks.push({ kind: "paragraph", text: text.join(" ") });
    }
  }
  return blocks;
};

const INLINE = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;

const Inline = ({ text }: { text: string }) => (
  <>
    {text.split(INLINE).map((part, i) => {
      if (part.startsWith("***") && part.endsWith("***") && part.length > 6)
        return (
          <strong key={i} className="font-semibold italic text-foreground">
            {part.slice(3, -3)}
          </strong>
        );
      if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
        return (
          <strong key={i} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
        return <em key={i}>{part.slice(1, -1)}</em>;
      return <React.Fragment key={i}>{part}</React.Fragment>;
    })}
  </>
);

const HEADING_CLASS: Record<number, string> = {
  2: "mt-2 font-display text-[21px] font-semibold",
  3: "mt-2 font-display text-[18px] font-semibold",
  4: "mt-1 font-display text-[16px] font-semibold",
  5: "font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground",
};

/** Numbers in table cells are mono, per the house style. */
const NUMERIC = /^[\d\s+\-–—×/.,%()dgpspc]+$/i;

const RuleMarkdown = ({ source }: { source: string }) => (
  <div className="flex min-w-0 flex-col gap-3 text-[14px] leading-relaxed text-foreground-2">
    {parse(source).map((block, i) => {
      switch (block.kind) {
        case "heading": {
          const Tag = `h${Math.min(block.level + 1, 6)}` as "h3";
          return (
            <Tag key={i} className={HEADING_CLASS[block.level]}>
              <Inline text={block.text} />
            </Tag>
          );
        }
        case "list": {
          const Tag = block.ordered ? "ol" : "ul";
          return (
            <Tag
              key={i}
              className={`flex flex-col gap-1 pl-5 ${block.ordered ? "list-decimal" : "list-disc"}`}
            >
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline text={item} />
                </li>
              ))}
            </Tag>
          );
        }
        case "table":
          return (
            <div
              key={i}
              className="max-w-full overflow-x-auto rounded-[10px] border border-border"
            >
              <table className="w-full border-collapse text-[13px]">
                <thead className="bg-secondary">
                  <tr>
                    {block.header.map((cell, j) => (
                      <th
                        key={j}
                        className="px-3 py-2 text-left font-semibold text-foreground"
                      >
                        <Inline text={cell} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, j) => (
                    <tr key={j} className="border-t border-hairline">
                      {row.map((cell, k) => (
                        <td
                          key={k}
                          className={`px-3 py-[7px] align-top ${NUMERIC.test(cell) ? "font-mono" : ""} ${cell.length <= 16 ? "whitespace-nowrap" : "min-w-[12ch]"}`}
                        >
                          <Inline text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        default:
          return (
            <p key={i}>
              <Inline text={block.text} />
            </p>
          );
      }
    })}
  </div>
);

export default RuleMarkdown;
