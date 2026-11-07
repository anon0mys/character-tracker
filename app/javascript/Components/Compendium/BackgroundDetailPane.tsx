import React from "react";
import { IBackgroundType, IBackgroundFeature } from "../../Api";
import { X } from "lucide-react";

const Caption = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-proficiency-ink">
    {children}
  </span>
);

const Features = ({
  title,
  items,
}: {
  title: string;
  items: IBackgroundFeature[];
}) =>
  items.length > 0 ? (
    <div className="flex flex-col gap-2">
      <Caption>{title}</Caption>
      {items.map((f, i) => (
        <p key={i} className="whitespace-pre-line text-[13px] leading-relaxed">
          <span className="font-semibold">{f.name}.</span> {f.description}
        </p>
      ))}
    </div>
  ) : null;

const RollTable = ({ title, rows }: { title: string; rows?: string[] }) =>
  rows && rows.length > 0 ? (
    <div className="flex flex-col gap-1">
      <span className="text-[12px] font-semibold">{title}</span>
      <ol className="flex flex-col gap-[2px]">
        {rows.map((r, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed">
            <span className="w-4 flex-shrink-0 font-mono text-[12px] text-muted-foreground">
              {i + 1}
            </span>
            <span>{r}</span>
          </li>
        ))}
      </ol>
    </div>
  ) : null;

const BackgroundDetailPane = ({
  background,
  onClose,
}: {
  background: IBackgroundType;
  onClose: () => void;
}) => {
  const chars = background.characteristics ?? {};
  return (
    <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
      <div className="flex items-start gap-2">
        <div className="flex flex-col gap-[3px]">
          <h2 className="font-display text-[26px] font-semibold leading-tight">
            {background.name}
          </h2>
          {background.source && (
            <span className="text-[13px] italic text-foreground-2">
              {background.source}
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

      <div className="flex flex-col gap-1 rounded-[10px] bg-secondary p-[11px_13px] text-[12.5px] text-foreground-2">
        {[
          ["Skills", background.skill_proficiencies],
          ["Tools", background.tool_proficiencies],
          ["Languages", background.languages],
          ["Equipment", background.equipment],
        ].map(
          ([label, val]) =>
            val && (
              <span key={label}>
                <span className="font-semibold">{label}:</span> {val}
              </span>
            ),
        )}
      </div>

      {background.description && (
        <p className="whitespace-pre-line text-[13px] leading-relaxed">
          {background.description}
        </p>
      )}

      <Features title="Features" items={background.features} />
      <Features title="Variants" items={background.variants} />

      {(chars.description ||
        chars.personality_traits ||
        chars.ideals ||
        chars.bonds ||
        chars.flaws) && (
        <div className="flex flex-col gap-3">
          <Caption>Suggested characteristics</Caption>
          {chars.description && (
            <p className="whitespace-pre-line text-[13px] leading-relaxed">
              {chars.description}
            </p>
          )}
          <RollTable
            title="Personality traits"
            rows={chars.personality_traits}
          />
          <RollTable title="Ideals" rows={chars.ideals} />
          <RollTable title="Bonds" rows={chars.bonds} />
          <RollTable title="Flaws" rows={chars.flaws} />
        </div>
      )}
    </div>
  );
};

export default BackgroundDetailPane;
