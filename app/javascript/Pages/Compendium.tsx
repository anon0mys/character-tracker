import React, { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  ISpellType,
  IItemType,
  IMonsterType,
  IRaceType,
  IBackgroundType,
  IFeatType,
} from "../Api";
import { cn } from "../lib/utils";
import { Dialog, DialogContent } from "../Components/ui";
import SpellsTab from "../Components/Compendium/SpellsTab";
import ItemsTab from "../Components/Compendium/ItemsTab";
import DetailPane from "../Components/Compendium/DetailPane";
import ItemDetailPane from "../Components/Compendium/ItemDetailPane";
import MonstersTab from "../Components/Compendium/MonstersTab";
import MonsterDetailPane from "../Components/Compendium/MonsterDetailPane";
import RacesTab from "../Components/Compendium/RacesTab";
import RaceDetailPane from "../Components/Compendium/RaceDetailPane";
import BackgroundsTab from "../Components/Compendium/BackgroundsTab";
import BackgroundDetailPane from "../Components/Compendium/BackgroundDetailPane";
import FeatsTab from "../Components/Compendium/FeatsTab";
import FeatDetailPane from "../Components/Compendium/FeatDetailPane";
import { useIsDesktop } from "../Hooks/useIsDesktop";

const tabs = [
  { key: "spells", label: "Spells" },
  { key: "items", label: "Items" },
  { key: "monsters", label: "Monsters" },
  { key: "races", label: "Races" },
  { key: "backgrounds", label: "Backgrounds" },
  { key: "feats", label: "Feats" },
];

const Compendium = () => {
  const { tab } = useParams<{ tab: string }>();
  const active = [
    "items",
    "monsters",
    "races",
    "backgrounds",
    "feats",
  ].includes(tab ?? "")
    ? tab!
    : "spells";
  const isDesktop = useIsDesktop();
  const [selected, setSelected] = useState<ISpellType | null>(null);
  const [selectedItem, setSelectedItem] = useState<IItemType | null>(null);
  const [selectedMonster, setSelectedMonster] = useState<IMonsterType | null>(
    null,
  );
  const [selectedRace, setSelectedRace] = useState<IRaceType | null>(null);
  const [selectedBackground, setSelectedBackground] =
    useState<IBackgroundType | null>(null);
  const [selectedFeat, setSelectedFeat] = useState<IFeatType | null>(null);

  return (
    <div className="flex min-h-[75vh] flex-col gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Compendium
        </h1>
        <p className="text-sm text-muted-foreground">
          Spells, items, monsters, races, backgrounds and feats.
        </p>
      </div>

      <div className="flex w-fit gap-[3px] rounded-[10px] border border-border bg-rail p-[3px]">
        {tabs.map(({ key, label }) => (
          <NavLink
            key={key}
            to={`/compendium/${key}`}
            onClick={() => {
              setSelected(null);
              setSelectedItem(null);
              setSelectedMonster(null);
              setSelectedRace(null);
              setSelectedBackground(null);
              setSelectedFeat(null);
            }}
            className={cn(
              "flex min-h-[38px] items-center rounded-lg px-4 text-[13px] no-underline",
              active === key
                ? "bg-card font-semibold text-foreground"
                : "text-foreground-2",
            )}
          >
            {label}
          </NavLink>
        ))}
      </div>

      {active === "races" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <RacesTab onSelect={setSelectedRace} selectedId={selectedRace?.id} />
          {selectedRace && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <RaceDetailPane
                race={selectedRace}
                onClose={() => setSelectedRace(null)}
              />
            </div>
          )}
        </div>
      ) : active === "backgrounds" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <BackgroundsTab
            onSelect={setSelectedBackground}
            selectedId={selectedBackground?.id}
          />
          {selectedBackground && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <BackgroundDetailPane
                background={selectedBackground}
                onClose={() => setSelectedBackground(null)}
              />
            </div>
          )}
        </div>
      ) : active === "feats" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <FeatsTab onSelect={setSelectedFeat} selectedId={selectedFeat?.id} />
          {selectedFeat && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <FeatDetailPane
                feat={selectedFeat}
                onClose={() => setSelectedFeat(null)}
              />
            </div>
          )}
        </div>
      ) : active === "monsters" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <MonstersTab
            onSelect={setSelectedMonster}
            selectedId={selectedMonster?.id}
          />
          {selectedMonster && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <MonsterDetailPane
                monster={selectedMonster}
                onClose={() => setSelectedMonster(null)}
              />
            </div>
          )}
        </div>
      ) : active === "items" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <ItemsTab onSelect={setSelectedItem} selectedId={selectedItem?.id} />
          {selectedItem && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <ItemDetailPane
                item={selectedItem}
                onClose={() => setSelectedItem(null)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-0 flex-grow gap-4">
          <SpellsTab onSelect={setSelected} selectedId={selected?.id} />
          {selected && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <DetailPane spell={selected} onClose={() => setSelected(null)} />
            </div>
          )}
        </div>
      )}

      {/* Phone: detail as a dialog takeover */}
      {selected && !isDesktop && (
        <Dialog open onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <DetailPane spell={selected} onClose={() => setSelected(null)} />
          </DialogContent>
        </Dialog>
      )}

      {selectedItem && !isDesktop && (
        <Dialog open onOpenChange={(o) => !o && setSelectedItem(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <ItemDetailPane
              item={selectedItem}
              onClose={() => setSelectedItem(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedMonster && !isDesktop && (
        <Dialog open onOpenChange={(o) => !o && setSelectedMonster(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <MonsterDetailPane
              monster={selectedMonster}
              onClose={() => setSelectedMonster(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedRace && !isDesktop && (
        <Dialog open onOpenChange={(o) => !o && setSelectedRace(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <RaceDetailPane
              race={selectedRace}
              onClose={() => setSelectedRace(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedBackground && !isDesktop && (
        <Dialog open onOpenChange={(o) => !o && setSelectedBackground(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <BackgroundDetailPane
              background={selectedBackground}
              onClose={() => setSelectedBackground(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {selectedFeat && !isDesktop && (
        <Dialog open onOpenChange={(o) => !o && setSelectedFeat(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto">
            <FeatDetailPane
              feat={selectedFeat}
              onClose={() => setSelectedFeat(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Compendium;
