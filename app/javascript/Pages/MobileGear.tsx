import React, { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useCharacterData } from "../Hooks/useCharacterData";
import { useIsDesktop } from "../Hooks/useIsDesktop";
import {
  PinnedHp,
  ReadOnlyFieldset,
  SheetAccessProvider,
} from "../Components/Sheet";
import GearTab from "../Components/Sheet/GearTab";
import ConsumablesTab from "../Components/Sheet/ConsumablesTab";
import { cn } from "../lib/utils";

type Tab = "gear" | "consumables";

const MobileGear = () => {
  const { id } = useParams();
  const isDesktop = useIsDesktop();
  const { character, patch } = useCharacterData(id);
  const [tab, setTab] = useState<Tab>("gear");
  const [takeover, setTakeover] = useState(false);

  if (isDesktop) return <Navigate to={`/characters/${id}`} replace />;
  if (!character.id)
    return <p className="py-10 text-center text-muted-foreground">Loading…</p>;

  return (
    <SheetAccessProvider character={character}>
      <div className="-mx-4 -my-4 flex min-h-[70vh] flex-col">
        <ReadOnlyFieldset>
          <PinnedHp character={character} patch={patch} />
        </ReadOnlyFieldset>
        <div
          className={cn(
            "m-4 mb-2 flex gap-[3px] rounded-[10px] bg-rail p-[3px]",
            takeover && "hidden",
          )}
        >
          {(["gear", "consumables"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "flex-grow rounded-[7px] py-[10px] text-center text-[13px] capitalize",
                tab === t
                  ? "bg-card font-semibold text-foreground"
                  : "text-foreground-2",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div
          className={cn(
            "flex flex-grow flex-col px-4 pb-4",
            takeover && "pt-4",
          )}
        >
          {tab === "gear" ? (
            <GearTab
              character={character}
              patch={patch}
              onTakeoverChange={setTakeover}
            />
          ) : (
            <ReadOnlyFieldset>
              <ConsumablesTab characterId={character.id} />
            </ReadOnlyFieldset>
          )}
        </div>
      </div>
    </SheetAccessProvider>
  );
};

export default MobileGear;
