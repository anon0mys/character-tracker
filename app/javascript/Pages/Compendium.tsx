import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Client,
  ISpellType,
  IItemType,
  IMonsterType,
  IRaceType,
  IBackgroundType,
  IFeatType,
  IRuleType,
} from "../Api";
import { cn } from "../lib/utils";
import { useAuth } from "../Auth";
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
import RulesTab from "../Components/Compendium/RulesTab";
import RuleDetailPane from "../Components/Compendium/RuleDetailPane";
import { useIsDesktop } from "../Hooks/useIsDesktop";
import useRecordView from "../Hooks/useRecordView";
import { PHONE_TAKEOVER } from "../Components/Shared/recordPanel";

const tabs = [
  { key: "spells", label: "Spells" },
  { key: "items", label: "Items" },
  { key: "monsters", label: "Monsters" },
  { key: "races", label: "Races" },
  { key: "backgrounds", label: "Backgrounds" },
  { key: "feats", label: "Feats" },
  { key: "rules", label: "Rules" },
];

const Compendium = () => {
  const { tab } = useParams<{ tab: string }>();
  const active = [
    "items",
    "monsters",
    "races",
    "backgrounds",
    "feats",
    "rules",
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
  const [selectedRule, setSelectedRule] = useState<IRuleType | null>(null);
  // The open entry lives in the URL (?id=12), so Back closes it and journal
  // chips can link to it. Desktop shows it beside the list; phones cover the
  // list with it, which stays where it was underneath.
  const view = useRecordView();
  const linkedId = view.params.get("id");
  const auth = useAuth();
  function pick<T extends { id?: number | null }>(
    set: React.Dispatch<React.SetStateAction<T | null>>,
  ) {
    return (record: T) => {
      set(record);
      if (record.id) view.open({ id: record.id });
    };
  }
  const closeDetail = () => view.close({ id: null });
  const current =
    {
      spells: selected,
      items: selectedItem,
      monsters: selectedMonster,
      races: selectedRace,
      backgrounds: selectedBackground,
      feats: selectedFeat,
      rules: selectedRule,
    }[active] ?? null;

  // Back (or a link without ?id) closes whatever was open.
  useEffect(() => {
    if (linkedId) return;
    setSelected(null);
    setSelectedItem(null);
    setSelectedMonster(null);
    setSelectedRace(null);
    setSelectedBackground(null);
    setSelectedFeat(null);
    if (!isDesktop) setSelectedRule(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkedId]);

  // A link (or Forward) to ?id=<n>: fetch that entry.
  useEffect(() => {
    if (String(current?.id ?? "") === linkedId) return;
    const select: Record<string, (record: any) => void> = {
      spells: setSelected,
      items: setSelectedItem,
      monsters: setSelectedMonster,
    };
    if (!linkedId || !select[active]) return;
    Client()
      .get({ path: `/${active}?id=${linkedId}`, token: auth.getToken() })
      .then((r) => r.data?.[0] && select[active](r.data[0]))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, linkedId]);

  return (
    <div className="flex min-h-[75vh] flex-col gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Compendium
        </h1>
        <p className="text-sm text-muted-foreground">
          Spells, items, monsters, races, backgrounds, feats and the rules.
        </p>
      </div>

      {/* The tabs outgrow a phone: they scroll sideways there. */}
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:px-0">
        <div className="flex w-max gap-[3px] rounded-[10px] border border-border bg-rail p-[3px]">
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
                setSelectedRule(null);
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
      </div>

      {active === "rules" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <RulesTab
            onSelect={pick(setSelectedRule)}
            selectedId={selectedRule?.id}
            onLoad={(rules) => {
              // A link's ?id= opens that rule; desktop otherwise opens the first.
              const linked = rules.find((r) => String(r.id) === linkedId);
              if (linked) setSelectedRule(linked);
              else if (isDesktop && rules[0]) setSelectedRule(rules[0]);
            }}
          />
          {selectedRule && isDesktop && (
            <div className="hidden min-w-0 flex-grow overflow-y-auto rounded-2xl border border-border bg-card p-[22px_26px] lg:block lg:max-h-[calc(100vh-170px)]">
              <div className="mx-auto max-w-[72ch]">
                <RuleDetailPane rule={selectedRule} />
              </div>
            </div>
          )}
        </div>
      ) : active === "races" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <RacesTab
            onSelect={pick(setSelectedRace)}
            selectedId={selectedRace?.id}
          />
          {selectedRace && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <RaceDetailPane race={selectedRace} onClose={closeDetail} />
            </div>
          )}
        </div>
      ) : active === "backgrounds" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <BackgroundsTab
            onSelect={pick(setSelectedBackground)}
            selectedId={selectedBackground?.id}
          />
          {selectedBackground && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <BackgroundDetailPane
                background={selectedBackground}
                onClose={closeDetail}
              />
            </div>
          )}
        </div>
      ) : active === "feats" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <FeatsTab
            onSelect={pick(setSelectedFeat)}
            selectedId={selectedFeat?.id}
          />
          {selectedFeat && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <FeatDetailPane feat={selectedFeat} onClose={closeDetail} />
            </div>
          )}
        </div>
      ) : active === "monsters" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <MonstersTab
            onSelect={pick(setSelectedMonster)}
            selectedId={selectedMonster?.id}
          />
          {selectedMonster && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <MonsterDetailPane
                monster={selectedMonster}
                onClose={closeDetail}
              />
            </div>
          )}
        </div>
      ) : active === "items" ? (
        <div className="flex min-h-0 flex-grow gap-4">
          <ItemsTab
            onSelect={pick(setSelectedItem)}
            selectedId={selectedItem?.id}
          />
          {selectedItem && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <ItemDetailPane item={selectedItem} onClose={closeDetail} />
            </div>
          )}
        </div>
      ) : (
        <div className="flex min-h-0 flex-grow gap-4">
          <SpellsTab onSelect={pick(setSelected)} selectedId={selected?.id} />
          {selected && isDesktop && (
            <div className="hidden w-[396px] flex-shrink-0 rounded-2xl border border-border bg-card p-[22px] lg:flex">
              <DetailPane spell={selected} onClose={closeDetail} />
            </div>
          )}
        </div>
      )}

      {/* Phone: detail as a dialog takeover */}
      {selected && !isDesktop && (
        <div className={PHONE_TAKEOVER}>
          <DetailPane spell={selected} onClose={closeDetail} />
        </div>
      )}

      {selectedItem && !isDesktop && (
        <div className={PHONE_TAKEOVER}>
          <ItemDetailPane item={selectedItem} onClose={closeDetail} />
        </div>
      )}

      {selectedMonster && !isDesktop && (
        <div className={PHONE_TAKEOVER}>
          <MonsterDetailPane monster={selectedMonster} onClose={closeDetail} />
        </div>
      )}

      {selectedRace && !isDesktop && (
        <div className={PHONE_TAKEOVER}>
          <RaceDetailPane race={selectedRace} onClose={closeDetail} />
        </div>
      )}

      {selectedBackground && !isDesktop && (
        <div className={PHONE_TAKEOVER}>
          <BackgroundDetailPane
            background={selectedBackground}
            onClose={closeDetail}
          />
        </div>
      )}

      {selectedRule && !isDesktop && (
        <div className={PHONE_TAKEOVER}>
          <RuleDetailPane rule={selectedRule} onClose={closeDetail} />
        </div>
      )}

      {selectedFeat && !isDesktop && (
        <div className={PHONE_TAKEOVER}>
          <FeatDetailPane feat={selectedFeat} onClose={closeDetail} />
        </div>
      )}
    </div>
  );
};

export default Compendium;
