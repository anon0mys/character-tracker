import React from "react";
import { ChevronLeft } from "lucide-react";
import { ISpellType } from "../../Api";

interface SpellDetailProps {
  spell: ISpellType;
  onBack: () => void;
}

const facts = (spell: ISpellType) => [
  { label: "Casting time", value: spell.casting_time },
  { label: "Range", value: spell.range },
  {
    label: "Components",
    value: Array.isArray(spell.components)
      ? spell.components.join(", ")
      : spell.components,
  },
  { label: "Duration", value: spell.duration },
];

// Detail takes over the panel it came from (back arrow at top) — never an overlay.
const SpellDetail = ({ spell, onBack }: SpellDetailProps) => {
  return (
    <div className="flex min-h-0 flex-grow flex-col gap-4 overflow-y-auto">
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] text-muted-foreground hover:bg-secondary"
        >
          <ChevronLeft className="h-[18px] w-[18px]" />
        </button>
        <div className="flex flex-col gap-[3px]">
          <h2 className="font-display text-[24px] font-semibold leading-tight">
            {spell.name}
          </h2>
          <span className="text-[13px] italic text-foreground-2">
            Level {spell.level} · {spell.school}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[10px]">
        {facts(spell).map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-[2px] rounded-[10px] bg-secondary p-[11px_13px]"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
              {label}
            </span>
            <span className="font-mono text-[14px]">{value}</span>
          </div>
        ))}
      </div>

      <p className="whitespace-pre-line text-[14px] leading-relaxed">
        {spell.description}
      </p>

      {spell.archetypes?.length > 0 && (
        <p className="text-[12.5px] text-muted-foreground">
          <span className="font-medium text-foreground-2">Classes: </span>
          {spell.archetypes.join(", ")}
        </p>
      )}
    </div>
  );
};

export default SpellDetail;
