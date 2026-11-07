import React from "react";
import { IRichNode } from "../../Api";
import { PERSON, PEOPLE_CHIP, THING, THING_CHIP } from "./mentions";

/** Renders one TipTap block read-only: text, plus @/# links as chips. */
const RichPreview = ({ node }: { node: IRichNode }) => (
  <>
    {(node.content ?? []).map((child, i) => {
      if (child.type === "text")
        return <React.Fragment key={i}>{child.text}</React.Fragment>;
      if (child.type === PERSON)
        return (
          <span key={i} className={PEOPLE_CHIP}>
            @{child.attrs?.label}
          </span>
        );
      if (child.type === THING)
        return (
          <span key={i} className={THING_CHIP}>
            #{child.attrs?.label}
          </span>
        );
      return <RichPreview key={i} node={child} />;
    })}
  </>
);

export default RichPreview;
