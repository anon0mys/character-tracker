import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button } from '../Components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../Components/ui';
import { Client, IAttackType, ICharacterType, ISpellListType } from '../Api';
import { useAuth } from '../Auth';
import { SpellListForm } from '../Components/Characters';
import { useError } from '../Errors';
import SpellTable from '../Components/Spells/SpellTable';
import AttackForm from '../Components/Characters/AttackForm';

const CharacterDisplay = () => {
    const { id } = useParams()
    const [spellListFormOpen, setSpellListFormOpen] = useState(false)
    const [spellLists, setSpellLists] = useState<ISpellListType[]>([])
    const [currentSpellList, setCurrentSpellList] = useState<ISpellListType>()
    const [attackModalOpen, setAttackModalOpen] = useState(false)
    const [character, setCharacter] = useState<ICharacterType>({
        name: '',
        race: '',
        archetype: '',
        background: '',
        alignment: '',
        age: 20,
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
        injury_condition: 'Healthy',
        hit_die: '',
        strength: {value: 10, modifier: 0, save: 0},
        dexterity: {value: 10, modifier: 0, save: 0},
        constitution: {value: 10, modifier: 0, save: 0},
        intelligence: {value: 10, modifier: 0, save: 0},
        wisdom: {value: 10, modifier: 0, save: 0},
        charisma: {value: 10, modifier: 0, save: 0},
    })
    const [attacks, setAttacks] = useState<IAttackType[]>(character?.attacks)
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        client.get({ path: `/characters/${id}`, token: auth.getToken() })
        .then(response => {
            setCharacter(response.data)
            setCurrentSpellList(response.data.current_spell_list)
            setAttacks(response.data.attacks || [])
        })
        .catch(error => errors.setError(error))
    }, [id])

    useEffect(() => {
        client.get({ path: `/characters/${id}/spell_lists`, token: auth.getToken() })
        .then(response => setSpellLists(response.data))
        .catch(error => errors.setError(error))
    }, [])

    const addSpellList = (spellList: ISpellListType) => {
        setSpellLists([...spellLists, spellList])
    }

    const selectSpellList = (value: string) => {
        if (value === 'Set Current list') return
        let spellList = spellLists.find(spellList => spellList.id === value)
        const data = {character: {current_spell_list_id: spellList && spellList.id}}
        client.patch({ path: `/characters/${id}`, payload: data, token: auth.getToken() })
        .then(response => setCurrentSpellList(spellList))
        .catch(error => errors.setError(error))
    }

    const closeAttackForm = (attack: IAttackType | undefined) => {
        if (attack) {
            setAttacks([...attacks, attack])
        }
        setAttackModalOpen(false)
    }

    const spellListOptions = spellLists.map(spellList => {
        return { label: spellList.name, value: spellList.id ? spellList.id.toString() : '' }
    })

    const attackRows = character.attacks.map((attack, index) => {
        return (
            <div key={attack.id || index} className="grid grid-cols-12 gap-4 py-2 border-b">
                <div className="col-span-3">
                    <span>{attack.name}</span>
                </div>
                <div className="col-span-2">
                    <span>{attack.bonus}</span>
                </div>
                <div className="col-span-4">
                    <span>{attack.description}</span>
                </div>
            </div>
        )
    })

    return (
        <>
            <h3 className="text-xl font-semibold mb-4">Character Info</h3>
            <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-4">
                    <p>Name: {character.name}</p>
                    <p>Race: {character.race}</p>
                </div>
                <div className="col-span-4">
                    <p>Class: {character.archetype} {character.level}</p>
                    <p>Background: {character.background}</p>
                </div>
                <div className="col-span-4">
                    <p>Alignment: {character.alignment}</p>
                    <p>Age: {character.age}</p>
                </div>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-4">
                    <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-3">
                            <div className="pt-6 space-y-2">
                                <p>Strength</p>
                                <p>Dexterity</p>
                                <p>Constitution</p>
                                <p>Intelligence</p>
                                <p>Wisdom</p>
                                <p>Charisma</p>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <p className="underline">Level</p>
                            <div className="flex items-center gap-2">
                                <span>{character.strength.value}</span>
                                <span className="text-xs">+{character.strength.modifier}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{character.dexterity.value}</span>
                                <span className="text-xs">+{character.dexterity.modifier}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{character.constitution.value}</span>
                                <span className="text-xs">+{character.constitution.modifier}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{character.intelligence.value}</span>
                                <span className="text-xs">+{character.intelligence.modifier}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{character.wisdom.value}</span>
                                <span className="text-xs">+{character.wisdom.modifier}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span>{character.charisma.value}</span>
                                <span className="text-xs">+{character.charisma.modifier}</span>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <p className="underline">Saves</p>
                            <div className="flex items-center gap-2">
                                <span>+{character.strength.save}</span>
                                {character.proficiencies.includes('strength') && <span className="text-xs">(Proficient)</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>+{character.dexterity.save}</span>
                                {character.proficiencies.includes('dexterity') && <span className="text-xs">(Proficient)</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>+{character.constitution.save}</span>
                                {character.proficiencies.includes('constitution') && <span className="text-xs">(Proficient)</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>+{character.intelligence.save}</span>
                                {character.proficiencies.includes('intelligence') && <span className="text-xs">(Proficient)</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>+{character.wisdom.save}</span>
                                {character.proficiencies.includes('wisdom') && <span className="text-xs">(Proficient)</span>}
                            </div>
                            <div className="flex items-center gap-2">
                                <span>+{character.charisma.save}</span>
                                {character.proficiencies.includes('charisma') && <span className="text-xs">(Proficient)</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-3">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span>Armor Class:</span>
                            <span>{character.ac}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Initiative:</span>
                            <span>+{character.initiative}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Speed:</span>
                            <span>{character.speed}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Perception:</span>
                            <span>{character.perception}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Proficiency Bonus:</span>
                            <span>+{character.proficiency_bonus}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Spell Attack Mod:</span>
                            <span>+{character.spell_attack_mod}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Spell Save DC:</span>
                            <span>{character.spell_save_dc}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Concentration Check:</span>
                            <span>+{character.concentration}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold">Attacks</h3>
                <Button onClick={() => setAttackModalOpen(true)}>Add Attack</Button>
            </div>
            <p className="mb-4">Attacks Per Turn: 2</p>
            <div className="grid grid-cols-12 gap-4 mb-2 pb-2 border-b">
                <div className="col-span-3">
                    <span className="underline">Attack</span>
                </div>
                <div className="col-span-2">
                    <span className="underline">Bonus</span>
                </div>
                <div className="col-span-4">
                    <span className="underline">Damage & Notes (simple weapons)</span>
                </div>
            </div>
            {attackRows}
            <AttackForm opened={attackModalOpen} onClose={closeAttackForm} attack={undefined} />
            <div className="flex items-center gap-4 mb-4 mt-6">
                <h3 className="text-xl font-semibold">HP and Abilities</h3>
            </div>
            <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-3">
                    <p>Hit Points: {character.total_hitpoints}</p>
                    <p>Current Hit Points: {character.current_hitpoints} [{character.injury_condition}]</p>
                </div>
                <div className="col-span-3">
                    <p>Temporary Hit Points: 0</p>
                </div>
                <div className="col-span-4">
                    <p>Rest Recovery ({character.hit_die} + {character.constitution.modifier}): 5</p>
                    <div className="mt-4">
                        <p>Abilities go here (some need counters)</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold">Current Spells: {currentSpellList && currentSpellList.name}</h3>
                <Select
                    value={currentSpellList?.id?.toString() || 'Set Current list'}
                    onValueChange={selectSpellList}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Set Current list" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Set Current list">Set Current list</SelectItem>
                        {spellListOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={() => setSpellListFormOpen(true)}>Add Spell List</Button>
            </div>
            {currentSpellList && <SpellTable spells={currentSpellList.spells} />}
            <SpellListForm characterId={character.id} open={spellListFormOpen} setOpen={setSpellListFormOpen} onSubmit={addSpellList} />
        </>
    )
}

export default CharacterDisplay
