import React from "react";
import { IAttackType } from "../../Api";

interface AttacksCardProps {
  attacks: IAttackType[];
  onAddAttack: () => void;
  onEditAttack?: (attack: IAttackType) => void;
}

const cols = "grid grid-cols-[1.7fr_0.8fr_1.1fr_2fr] gap-3";

const actionTag = (t?: string) => {
  if (!t || t === "action") return null;
  const label = t === "bonus" ? "BA" : t;
  return (
    <span className="ml-1 font-mono text-[10px] uppercase text-muted-foreground">
      {label}
    </span>
  );
};

const AttacksCard = ({
  attacks,
  onAddAttack,
  onEditAttack,
}: AttacksCardProps) => {
  return (
    <div className="flex min-w-0 flex-grow flex-col gap-[9px] rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-[10px]">
        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
          Attacks
        </span>
        <button
          type="button"
          onClick={onAddAttack}
          className="ml-auto min-h-[34px] rounded-[9px] border border-border-strong px-3 text-[12px]"
        >
          Add attack
        </button>
      </div>

      {attacks.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-muted-foreground">
          No attacks yet.
        </p>
      ) : (
        <>
          <div
            className={`${cols} border-b border-hairline px-[10px] pb-[7px]`}
          >
            {["Name", "Hit", "Damage", "Notes"].map((h) => (
              <span
                key={h}
                className="font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground"
              >
                {h}
              </span>
            ))}
          </div>
          <div className="flex flex-col gap-[5px]">
            {attacks.map((attack, i) => (
              <div
                key={attack.id || i}
                className="rounded-[10px] odd:bg-secondary"
                onClick={() => onEditAttack?.(attack)}
                role={onEditAttack ? "button" : undefined}
              >
                <div className={`${cols} items-center px-[10px] py-[9px]`}>
                  <span className="text-[14.5px] font-semibold">
                    {attack.name}
                    {attack.extra_attack && (
                      <span className="ml-2 rounded-full bg-harm-soft px-[6px] py-[2px] font-mono text-[9.5px] uppercase text-harm">
                        ×2
                      </span>
                    )}
                    {actionTag(attack.action_type)}
                  </span>
                  <span className="font-mono text-[15px] text-proficiency">
                    {attack.bonus}
                  </span>
                  <span className="font-mono text-[15px]">
                    {attack.damage || "—"}
                  </span>
                  <span className="text-[12.5px] text-foreground-2">
                    {attack.description}
                  </span>
                </div>
                {(attack.riders ?? []).map((rider, ri) => (
                  <div
                    key={ri}
                    className={`${cols} items-center px-[10px] py-[6px] pl-[26px]`}
                  >
                    <span className="text-[12.5px] text-foreground-2">
                      ↳ {rider.name}
                      {rider.tag && (
                        <span className="ml-1 font-mono text-[10px] text-proficiency-ink">
                          {rider.tag}
                        </span>
                      )}
                    </span>
                    <span />
                    <span className="font-mono text-[12.5px] text-foreground-2">
                      {rider.damage || ""}
                    </span>
                    <span className="text-[12.5px] text-foreground-2">
                      {rider.note}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AttacksCard;
