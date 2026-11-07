import React from "react";
import { IRaceType, IRaceTrait, IRaceSubrace, IRaceVersion } from "../../Api";
import { X } from "lucide-react";

const Caption = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-proficiency-ink">
    {children}
  </span>
);

const Traits = ({ traits }: { traits: IRaceTrait[] }) =>
  traits.length > 0 ? (
    <div className="flex flex-col gap-2">
      {traits.map((t, i) => (
        <p key={i} className="whitespace-pre-line text-[13px] leading-relaxed">
          {t.name && <span className="font-semibold">{t.name}. </span>}
          {t.description}
        </p>
      ))}
    </div>
  ) : null;

const Subrace = ({ subrace }: { subrace: IRaceSubrace }) => (
  <div className="flex flex-col gap-2 rounded-[10px] bg-secondary p-[11px_13px]">
    <span className="font-display text-[16px] font-semibold">
      {subrace.name}
    </span>
    {subrace.description && (
      <p className="whitespace-pre-line text-[13px] leading-relaxed text-foreground-2">
        {subrace.description}
      </p>
    )}
    <Traits traits={subrace.traits} />
  </div>
);

const Version = ({ version }: { version: IRaceVersion }) => (
  <div className="flex flex-col gap-3 border-t border-hairline pt-3">
    <Caption>{version.source || "Alternate version"}</Caption>
    {version.description && (
      <p className="whitespace-pre-line text-[13px] leading-relaxed">
        {version.description}
      </p>
    )}
    <Traits traits={version.traits} />
    {version.subraces.map((s, i) => (
      <Subrace key={i} subrace={s} />
    ))}
  </div>
);

const RaceDetailPane = ({
  race,
  onClose,
}: {
  race: IRaceType;
  onClose: () => void;
}) => (
  <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
    <div className="flex items-start gap-2">
      <div className="flex flex-col gap-[3px]">
        <h2 className="font-display text-[26px] font-semibold leading-tight">
          {race.name}
        </h2>
        <span className="text-[13px] italic text-foreground-2">
          {race.category}
          {race.source ? ` · ${race.source}` : ""}
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
      {[
        ["Size", race.size || "—"],
        ["Speed", race.speed != null ? `${race.speed} ft` : "—"],
      ].map(([label, val]) => (
        <div
          key={label}
          className="flex flex-col gap-[2px] rounded-[10px] bg-secondary p-[11px_13px]"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
            {label}
          </span>
          <span className="font-mono text-[18px] font-semibold">{val}</span>
        </div>
      ))}
    </div>

    {race.description && (
      <p className="whitespace-pre-line text-[13px] leading-relaxed">
        {race.description}
      </p>
    )}

    {race.traits.length > 0 && (
      <div className="flex flex-col gap-2">
        <Caption>Traits</Caption>
        <Traits traits={race.traits} />
      </div>
    )}

    {race.subraces.length > 0 && (
      <div className="flex flex-col gap-2">
        <Caption>Subraces</Caption>
        {race.subraces.map((s, i) => (
          <Subrace key={i} subrace={s} />
        ))}
      </div>
    )}

    {race.alternate_versions.map((v, i) => (
      <Version key={i} version={v} />
    ))}
  </div>
);

export default RaceDetailPane;
