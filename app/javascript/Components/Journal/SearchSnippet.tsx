import React from "react";

/** The marks the server puts around matched words (JournalSearch::HIGHLIGHT). */
const HIGHLIGHT_OPEN = "⟦";
const HIGHLIGHT_CLOSE = "⟧";
const MARKED = new RegExp(`${HIGHLIGHT_OPEN}(.*?)${HIGHLIGHT_CLOSE}`, "g");

/**
 * A search hit's snippet as text, with the matched words highlighted. Line
 * breaks between paragraphs and list items read as " · ".
 */
const SearchSnippet = ({ text }: { text: string }) => {
  const parts = text.replace(/\s*\n\s*/g, " · ").split(MARKED);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="rounded-[4px] bg-proficiency-soft px-[2px] font-semibold text-proficiency-ink"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

export default SearchSnippet;
