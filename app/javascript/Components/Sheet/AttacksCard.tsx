import React from "react";
import { IAttackType } from "../../Api";

interface AttacksCardProps {
  attacks: IAttackType[];
  onAddAttack: () => void;
}

const cols = "grid grid-cols-[1.7fr_0.8fr_1.1fr_2fr] gap-3";

const AttacksCard = ({ attacks, onAddAttack }: AttacksCardProps) => {
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
                className={`${cols} items-center rounded-[10px] px-[10px] py-[9px] odd:bg-secondary`}
              >
                <span className="text-[14.5px] font-semibold">
                  {attack.name}
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
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AttacksCard;
