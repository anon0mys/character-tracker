import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Client, IAttackType, ICharacterType, ISpellListType } from "../Api";
import { useAuth } from "../Auth";
import { useError } from "../Errors";
import { SpellListForm } from "../Components/Characters";
import AttackForm from "../Components/Characters/AttackForm";
import { useCharacterPatch } from "../Hooks/useCharacterPatch";
import {
  IdentityHeader,
  AbilitiesCard,
  CombatCard,
  SkillsCard,
  HpBand,
  AttacksCard,
  RightPanel,
  LoadoutBar,
  PinnedHp,
} from "../Components/Sheet";
import { cn } from "../lib/utils";

const emptyAbility = { value: 10, modifier: 0, save: 0 };

const emptyCharacter: ICharacterType = {
  name: "",
  race: "",
  archetype: "",
  background: "",
  alignment: "",
  age: 0,
  level: 1,
  speed: 30,
  initiative: 0,
  ac: 0,
  perception: 0,
  proficiency_bonus: 0,
  proficiencies: [],
  attacks: [],
  spell_attack_mod: 0,
  spell_save_dc: 0,
  concentration: 0,
  total_hitpoints: 0,
  current_hitpoints: 0,
  max_hitpoints: 0,
  max_hitpoints_bonus: 0,
  temp_hitpoints: 0,
  hit_dice_remaining: null,
  hit_die_type: "",
  inspiration: 0,
  death_save_successes: 0,
  death_save_failures: 0,
  exhaustion: 0,
  spell_slots_used: {},
  spell_slots_max: [],
  pact_slot_level: null,
  concentration_spell: null,
  copper: 0,
  silver: 0,
  electrum: 0,
  gold: 0,
  platinum: 0,
  character_trackers: [],
  injury_condition: "Healthy",
  hit_die: "",
  strength: emptyAbility,
  dexterity: emptyAbility,
  constitution: emptyAbility,
  intelligence: emptyAbility,
  wisdom: emptyAbility,
  charisma: emptyAbility,
};

const NO_LIST = "none";

const CharacterDisplay = () => {
  const { id } = useParams();
  const [character, setCharacter] = useState<ICharacterType>(emptyCharacter);
  const [attacks, setAttacks] = useState<IAttackType[]>([]);
  const [spellLists, setSpellLists] = useState<ISpellListType[]>([]);
  const [currentSpellList, setCurrentSpellList] = useState<ISpellListType>();
  const [attackModalOpen, setAttackModalOpen] = useState(false);
  const [editingAttack, setEditingAttack] = useState<IAttackType | undefined>();
  const [spellListFormOpen, setSpellListFormOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<
    "combat" | "abilities" | "skills" | "bio"
  >("combat");
  const { patch } = useCharacterPatch(character, setCharacter);
  const auth = useAuth();
  const client = Client();
  const errors = useError();

  useEffect(() => {
    client
      .get({ path: `/characters/${id}`, token: auth.getToken() })
      .then((response) => {
        setCharacter(response.data);
        setCurrentSpellList(response.data.current_spell_list);
        setAttacks(response.data.attacks || []);
      })
      .catch((error) => errors.setError(error));
  }, [id]);

  useEffect(() => {
    client
      .get({ path: `/characters/${id}/spell_lists`, token: auth.getToken() })
      .then((response) => setSpellLists(response.data))
      .catch((error) => errors.setError(error));
  }, [id]);

  const selectSpellList = (value: string) => {
    const nextId = value === NO_LIST ? null : Number(value);
    const nextList =
      value === NO_LIST
        ? undefined
        : spellLists.find((l) => String(l.id) === value);
    client
      .patch({
        path: `/characters/${id}`,
        payload: { character: { current_spell_list_id: nextId } },
        token: auth.getToken(),
        showSuccessToast: false,
      })
      .then(() => setCurrentSpellList(nextList))
      .catch((error) => errors.setError(error));
  };

  const closeAttackForm = (attack: IAttackType | undefined) => {
    if (attack) {
      setAttacks((prev) => {
        const exists = prev.some((a) => a.id === attack.id);
        return exists
          ? prev.map((a) => (a.id === attack.id ? attack : a))
          : [...prev, attack];
      });
    }
    setAttackModalOpen(false);
    setEditingAttack(undefined);
  };

  const openEditAttack = (attack: IAttackType) => {
    setEditingAttack(attack);
    setAttackModalOpen(true);
  };

  if (!character.id) {
    return (
      <p className="py-10 text-center text-muted-foreground">
        Loading character…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-[14px]">
      <IdentityHeader character={character} onRested={setCharacter} />

      <LoadoutBar character={character} onChange={setCharacter} />

      {/* Desktop: the full sheet in one view */}
      <div className="hidden lg:flex lg:flex-col lg:gap-[14px]">
        <div className="flex flex-row gap-[13px]">
          <AbilitiesCard character={character} />
          <CombatCard character={character} />
          <SkillsCard character={character} patch={patch} />
        </div>

        <HpBand character={character} patch={patch} />

        <div className="flex flex-row gap-[13px]">
          <AttacksCard
            attacks={attacks}
            onAddAttack={() => {
              setEditingAttack(undefined);
              setAttackModalOpen(true);
            }}
            onEditAttack={openEditAttack}
            activeLoadoutId={character.active_loadout_id}
          />
          <RightPanel
            character={character}
            spellLists={spellLists}
            currentSpellList={currentSpellList}
            onSelectSpellList={selectSpellList}
            onAddSpellList={() => setSpellListFormOpen(true)}
            patch={patch}
          />
        </div>
      </div>

      {/* Phone: pinned HP + segmented reference sections. Attacks / Spells /
          Gear are their own bottom-tab screens. */}
      <div className="-mx-4 -mt-[14px] flex flex-col lg:hidden">
        <PinnedHp character={character} patch={patch} />
        <div className="flex gap-[6px] overflow-x-auto px-4 pb-1 pt-3">
          {(["combat", "abilities", "skills", "bio"] as const).map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => setMobileSection(sec)}
              className={cn(
                "min-h-[40px] flex-shrink-0 rounded-full px-4 text-[13px] capitalize",
                mobileSection === sec
                  ? "bg-foreground text-background font-semibold"
                  : "border border-border bg-card text-foreground-2",
              )}
            >
              {sec}
            </button>
          ))}
        </div>
        <div className="px-4 pt-3">
          {mobileSection === "combat" && <CombatCard character={character} />}
          {mobileSection === "abilities" && (
            <AbilitiesCard character={character} />
          )}
          {mobileSection === "skills" && (
            <SkillsCard character={character} patch={patch} />
          )}
          {mobileSection === "bio" && (
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    Subclass
                  </span>
                  <span className="text-[14px]">
                    {character.subclass || "—"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    Languages
                  </span>
                  <span className="text-[14px]">
                    {(character.languages ?? []).join(", ") || "—"}
                  </span>
                </div>
              </div>
              {(
                [
                  ["trait", "Trait"],
                  ["ideal", "Ideal"],
                  ["bond", "Bond"],
                  ["flaw", "Flaw"],
                ] as const
              ).map(([k, label]) =>
                character[k] ? (
                  <div key={k} className="flex flex-col">
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-[13px] leading-relaxed text-foreground-2">
                      {character[k] as string}
                    </span>
                  </div>
                ) : null,
              )}
              <span className="text-[11px] text-muted-foreground">
                Edit bio on the Features tab.
              </span>
            </div>
          )}
        </div>
      </div>

      <AttackForm
        opened={attackModalOpen}
        onClose={closeAttackForm}
        attack={editingAttack}
        characterId={character.id}
      />
      <SpellListForm
        characterId={character.id}
        open={spellListFormOpen}
        setOpen={setSpellListFormOpen}
        onSubmit={(list: ISpellListType) =>
          setSpellLists([...spellLists, list])
        }
      />
    </div>
  );
};

export default CharacterDisplay;
