import React from "react";
import { IRuleType } from "../../Api";
import RuleMarkdown from "./RuleMarkdown";
import PaneBack from "./PaneBack";

const RuleDetailPane = ({
  rule,
  onClose,
}: {
  rule: IRuleType;
  onClose?: () => void;
}) => (
  <div className="flex min-h-0 w-full min-w-0 flex-col gap-4">
    {onClose && <PaneBack onBack={onClose} label="Back to rules" />}
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-[3px]">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted-foreground">
          {rule.category}
        </span>
        <h2 className="font-display text-[26px] font-semibold leading-tight">
          {rule.name}
        </h2>
      </div>
    </div>
    <RuleMarkdown source={rule.body} />
    <p className="border-t border-hairline pt-3 text-[11.5px] text-muted-foreground">
      {rule.source === "SRD 5.1"
        ? "From the System Reference Document 5.1 by Wizards of the Coast, licensed under CC-BY-4.0."
        : "A quick-reference table for this app, not text from the System Reference Document."}
    </p>
  </div>
);

export default RuleDetailPane;
