import React from "react";
import { ICharacterType } from "../../Api";
import { Input } from "../ui";

interface Props {
  character: ICharacterType;
  patch: (
    updates: Partial<ICharacterType>,
    opts?: { debounce?: boolean },
  ) => void;
}

const COINS: { field: keyof ICharacterType; label: string; color: string }[] = [
  { field: "copper", label: "CP", color: "text-orange-700" },
  { field: "silver", label: "SP", color: "text-slate-500" },
  { field: "electrum", label: "EP", color: "text-lime-600" },
  { field: "gold", label: "GP", color: "text-amber-500" },
  { field: "platinum", label: "PP", color: "text-cyan-400" },
];

const CurrencyFooter = ({ character, patch }: Props) => {
  return (
    <div className="bg-card  rounded-xl border border-border shadow-lg p-4 sm:p-5 mb-4 sm:mb-6">
      <h3 className="text-base sm:text-lg font-bold text-primary mb-3">
        Currency
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {COINS.map(({ field, label, color }) => (
          <label key={field} className="flex flex-col items-center gap-1">
            <span className={`text-xs font-bold ${color}`}>{label}</span>
            <Input
              inputMode="numeric"
              value={character[field] as number}
              onChange={(e) =>
                patch({
                  [field]: Math.max(0, parseInt(e.target.value || "0", 10)),
                } as Partial<ICharacterType>)
              }
              className="h-8 text-center"
            />
          </label>
        ))}
      </div>
    </div>
  );
};

export default CurrencyFooter;
