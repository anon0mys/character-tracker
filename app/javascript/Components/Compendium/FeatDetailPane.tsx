import React from "react";
import { IFeatType } from "../../Api";
import { X } from "lucide-react";

const FeatDetailPane = ({
  feat,
  onClose,
}: {
  feat: IFeatType;
  onClose: () => void;
}) => (
  <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-[3px]">
        <h2 className="font-display text-[26px] font-semibold leading-tight">
          {feat.name}
        </h2>
        {feat.source && (
          <span className="text-[13px] italic text-foreground-2">
            {feat.source}
          </span>
        )}
      </div>
      <button
        type="button"
        aria-label="Close detail"
        onClick={onClose}
        className="ml-auto flex h-9 w-9 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-secondary"
      >
        <X className="h-[18px] w-[18px]" />
      </button>
    </div>

    {feat.prerequisite && (
      <div className="rounded-[10px] bg-secondary p-[11px_13px] text-[12.5px] text-foreground-2">
        <span className="font-semibold">Prerequisite:</span> {feat.prerequisite}
      </div>
    )}

    {feat.description && (
      <p className="whitespace-pre-line text-[13px] leading-relaxed">
        {feat.description}
      </p>
    )}

    {feat.benefits.length > 0 && (
      <ul className="flex list-disc flex-col gap-2 pl-5">
        {feat.benefits.map((b, i) => (
          <li
            key={i}
            className="whitespace-pre-line text-[13px] leading-relaxed"
          >
            {b}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default FeatDetailPane;
