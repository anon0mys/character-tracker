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
            <div key={attack.id || index} className="grid grid-cols-12 gap-4 py-3 px-2 rounded hover:bg-accent/50 transition-colors group">
                <div className="col-span-3 font-medium group-hover:text-primary transition-colors">
                    {attack.name}
                </div>
                <div className="col-span-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                        {attack.bonus}
                    </span>
                </div>
                <div className="col-span-4 text-sm text-muted-foreground">
                    {attack.description}
                </div>
            </div>
        )
    })

    return (
        <>
            <div className="mb-8">
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-neon-cyan">{character.name}</h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <span className="font-medium">Level {character.level}</span>
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded-md text-sm font-semibold neon-glow">
                            {character.archetype}
                        </span>
                    </span>
                    <span>•</span>
                    <span>{character.race}</span>
                </div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-primary/20 text-neon-cyan">Character Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div className="font-semibold">{character.name}</div>
                        <div className="text-sm text-muted-foreground mt-3">Race</div>
                        <div className="font-semibold">{character.race}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Class & Level</div>
                        <div className="font-semibold">{character.archetype} {character.level}</div>
                        <div className="text-sm text-muted-foreground mt-3">Background</div>
                        <div className="font-semibold">{character.background}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Alignment</div>
                        <div className="font-semibold">{character.alignment}</div>
                        <div className="text-sm text-muted-foreground mt-3">Age</div>
                        <div className="font-semibold">{character.age}</div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2 bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 pb-2 border-b border-primary/20 text-neon-cyan">Ability Scores</h3>
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-2 space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase">Ability</div>
                            <div className="space-y-3 pt-1">
                                <div className="font-medium">Strength</div>
                                <div className="font-medium">Dexterity</div>
                                <div className="font-medium">Constitution</div>
                                <div className="font-medium">Intelligence</div>
                                <div className="font-medium">Wisdom</div>
                                <div className="font-medium">Charisma</div>
                            </div>
                        </div>
                        <div className="col-span-2 space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase">Score</div>
                            <div className="space-y-3 pt-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold">{character.strength.value}</span>
                                    <span className="text-sm text-primary font-semibold">+{character.strength.modifier}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold">{character.dexterity.value}</span>
                                    <span className="text-sm text-primary font-semibold">+{character.dexterity.modifier}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold">{character.constitution.value}</span>
                                    <span className="text-sm text-primary font-semibold">+{character.constitution.modifier}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold">{character.intelligence.value}</span>
                                    <span className="text-sm text-primary font-semibold">+{character.intelligence.modifier}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold">{character.wisdom.value}</span>
                                    <span className="text-sm text-primary font-semibold">+{character.wisdom.modifier}</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold">{character.charisma.value}</span>
                                    <span className="text-sm text-primary font-semibold">+{character.charisma.modifier}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-2 space-y-1">
                            <div className="text-xs font-medium text-muted-foreground uppercase">Saves</div>
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">+{character.strength.save}</span>
                                    {character.proficiencies.includes('strength') && (
                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">✓</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">+{character.dexterity.save}</span>
                                    {character.proficiencies.includes('dexterity') && (
                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">✓</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">+{character.constitution.save}</span>
                                    {character.proficiencies.includes('constitution') && (
                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">✓</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">+{character.intelligence.save}</span>
                                    {character.proficiencies.includes('intelligence') && (
                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">✓</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">+{character.wisdom.save}</span>
                                    {character.proficiencies.includes('wisdom') && (
                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">✓</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">+{character.charisma.save}</span>
                                    {character.proficiencies.includes('charisma') && (
                                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">✓</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4 pb-2 border-b border-primary/20 text-neon-cyan">Combat Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Armor Class</span>
                            <span className="text-xl font-bold">{character.ac}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Initiative</span>
                            <span className="text-xl font-bold">+{character.initiative}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Speed</span>
                            <span className="text-xl font-bold">{character.speed} ft</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Perception</span>
                            <span className="text-xl font-bold">+{character.perception}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Proficiency</span>
                            <span className="text-xl font-bold">+{character.proficiency_bonus}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Spell Attack</span>
                            <span className="text-xl font-bold">+{character.spell_attack_mod}</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b">
                            <span className="text-sm text-muted-foreground">Spell Save DC</span>
                            <span className="text-xl font-bold">{character.spell_save_dc}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Concentration</span>
                            <span className="text-xl font-bold">+{character.concentration}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-neon-cyan">Attacks</h3>
                    <Button onClick={() => setAttackModalOpen(true)} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">Add Attack</Button>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Attacks Per Turn: 2</p>
                {attackRows.length > 0 ? (
                    <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-4 pb-2 border-b font-medium text-sm text-muted-foreground">
                            <div className="col-span-3">Attack</div>
                            <div className="col-span-2">Bonus</div>
                            <div className="col-span-4">Damage & Notes</div>
                        </div>
                        <div className="space-y-1">{attackRows}</div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No attacks added yet</p>
                )}
            </div>
            <AttackForm opened={attackModalOpen} onClose={closeAttackForm} attack={undefined} />
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-primary/20 text-neon-cyan">Hit Points & Abilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Total Hit Points</div>
                            <div className="text-2xl font-bold">{character.total_hitpoints}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Current Hit Points</div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold">{character.current_hitpoints}</span>
                                <span className="px-2 py-1 bg-muted rounded text-sm">{character.injury_condition}</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Temporary Hit Points</div>
                            <div className="text-2xl font-bold">0</div>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <div className="text-sm text-muted-foreground mb-1">Rest Recovery</div>
                            <div className="text-lg font-semibold">{character.hit_die} + {character.constitution.modifier} = 5</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6 mb-6">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex-1 min-w-[200px]">
                        <h3 className="text-lg font-bold mb-2 text-neon-cyan">Current Spells</h3>
                        {currentSpellList ? (
                            <p className="text-sm text-muted-foreground">{currentSpellList.name}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">No spell list selected</p>
                        )}
                    </div>
                    <div className="flex gap-2">
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
                        <Button onClick={() => setSpellListFormOpen(true)} size="sm">Add Spell List</Button>
                    </div>
                </div>
            </div>
            {currentSpellList && <SpellTable spells={currentSpellList.spells} />}
            <SpellListForm characterId={character.id} open={spellListFormOpen} setOpen={setSpellListFormOpen} onSubmit={addSpellList} />
        </>
    )
}

export default CharacterDisplay
