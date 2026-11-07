import React from "react";
import { IRichNode } from "../../Api";
import {
  DEAD_CHIP,
  PERSON,
  PEOPLE_CHIP,
  THING,
  THING_CHIP,
  refKey,
} from "./mentions";

/**
 * Renders one TipTap block read-only: text, plus @/# links as chips. A chip
 * whose record was deleted (its refKey in `missing`) shows as plain text.
 */
const RichPreview = ({
  node,
  missing,
}: {
  node: IRichNode;
  missing?: Set<string>;
}) => (
  <>
    {(node.content ?? []).map((child, i) => {
      if (child.type === "text")
        return <React.Fragment key={i}>{child.text}</React.Fragment>;
      if (child.type === PERSON || child.type === THING) {
        const label = child.attrs?.label;
        if (missing?.has(refKey(child.attrs as any)))
          return (
            <span key={i} className={DEAD_CHIP}>
              {label}
            </span>
          );
        return child.type === PERSON ? (
          <span key={i} className={PEOPLE_CHIP}>
            @{label}
          </span>
        ) : (
          <span key={i} className={THING_CHIP}>
            #{label}
          </span>
        );
      }
      return <RichPreview key={i} node={child} missing={missing} />;
    })}
  </>
);

export default RichPreview;
