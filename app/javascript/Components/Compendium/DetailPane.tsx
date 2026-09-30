import React, { useState } from "react";
import { ISpellType } from "../../Api";
import { AddSpellForm } from "../Characters";
import { Button } from "../ui";
import { X, Plus } from "lucide-react";

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

interface DetailPaneProps {
  spell: ISpellType;
  onClose: () => void;
}

const DetailPane = ({ spell, onClose }: DetailPaneProps) => {
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-[3px]">
          <h2 className="font-display text-[26px] font-semibold leading-tight">
            {spell.name}
          </h2>
          <span className="text-[14px] italic text-foreground-2">
            Level {spell.level} · {spell.school}
          </span>
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

      <div className="mt-auto">
        <Button className="w-full" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add to a list
        </Button>
      </div>

      <AddSpellForm
        spell={spell}
        opened={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={() => setAddOpen(false)}
      />
    </div>
  );
};

export default DetailPane;
