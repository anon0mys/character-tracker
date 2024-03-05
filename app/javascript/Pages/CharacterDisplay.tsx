import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button, Grid, Group, NativeSelect, Select, Space, Text, Title } from '@mantine/core';
import { Client, IAttackType, ICharacterType, ISpellListType } from '../Api';
import { useAuth } from '../Auth';
import { SpellListForm } from '../Components/Characters';
import { useError } from '../Errors';
import SpellTable from '../Components/Spells/SpellTable';
import { useDisclosure } from '@mantine/hooks';
import AttackForm from '../Components/Characters/AttackForm';

const CharacterDisplay = () => {
    const { id } = useParams()
    const [spellListFormOpen, setSpellListFormOpen] = useState(false)
    const [spellLists, setSpellLists] = useState<ISpellListType[]>([])
    const [currentSpellList, setCurrentSpellList] = useState<ISpellListType>()
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
    const [attackModalOpen, { open, close }] = useDisclosure(false);

    useEffect(() => {
        client.get({ path: `/characters/${id}`, token: auth.getToken() })
        .then(response => {
            setCharacter(response.data)
            setCurrentSpellList(response.data.current_spell_list)
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

    const selectSpellList = (event) => {
        let spellList = spellLists.find(spellList => spellList.id == event.target.value)
        const data = {character: {current_spell_list_id: spellList && spellList.id}}
        client.patch({ path: `/characters/${id}`, payload: data, token: auth.getToken() })
        .then(response => setCurrentSpellList(spellList))
    }

    const closeAttackForm = (attack) => {
        setAttacks([attacks, attack])
        close()
    }

    const spellListOptions = spellLists.map(spellList => {
        return { label: spellList.name, value: spellList.id ? spellList.id.toString() : '' }
    })

    const attackRows = character.attacks.map(attack => {
        return (
            <Group>
                <Text>{attack.name}</Text>
                <Text>{attack.bonus}</Text>
                <Text>{attack.description}</Text>
            </Group>
        )
    })

    return (
        <>
            <Title order={3}>Character Info</Title>
            <Space h='lg' />
            <Grid>
                <Grid.Col span={4}>
                    <Text>Name: {character.name}</Text>
                    <Text>Race: {character.race}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Text>Class: {character.archetype} {character.level}</Text>
                    <Text>Background: {character.background}</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Text>Alignment: {character.alignment}</Text>
                    <Text>Age: {character.age}</Text>
                </Grid.Col>
            </Grid>
            <Space h="xl" />
            <Grid>
                <Grid.Col span={4}>
                    <Grid>
                        <Grid.Col span={3}>
                            <Space h="lg" />
                            <Text>Strength</Text>
                            <Text>Dexterity</Text>
                            <Text>Constitution</Text>
                            <Text>Intelligence</Text>
                            <Text>Wisdom</Text>
                            <Text>Charisma</Text>
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Text td="underline">Level</Text>
                            <Group>
                                <Text>{character.strength.value}</Text>
                                <Text size='xs'>+{character.strength.modifier}</Text>
                            </Group>
                            <Group>
                                <Text>{character.dexterity.value}</Text>
                                <Text size='xs'>+{character.dexterity.modifier}</Text>
                            </Group>
                            <Group>
                                <Text>{character.constitution.value}</Text>
                                <Text size='xs'>+{character.constitution.modifier}</Text>
                            </Group>
                            <Group>
                                <Text>{character.intelligence.value}</Text>
                                <Text size='xs'>+{character.intelligence.modifier}</Text>
                            </Group>
                            <Group>
                                <Text>{character.wisdom.value}</Text>
                                <Text size='xs'>+{character.wisdom.modifier}</Text>
                            </Group>
                            <Group>
                                <Text>{character.charisma.value}</Text>
                                <Text size='xs'>+{character.charisma.modifier}</Text>
                            </Group>
                        </Grid.Col>
                        <Grid.Col span={3}>
                            <Text td="underline">Saves</Text>
                            <Group>
                                <Text>+{character.strength.save}</Text>
                                {character.proficiencies.includes('strength') && <Text size='xs'>(Proficient)</Text>}
                            </Group>
                            <Group>
                                <Text>+{character.dexterity.save}</Text>
                                {character.proficiencies.includes('dexterity') && <Text size='xs'>(Proficient)</Text>}
                            </Group>
                            <Group>
                                <Text>+{character.constitution.save}</Text>
                                {character.proficiencies.includes('constitution') && <Text size='xs'>(Proficient)</Text>}
                            </Group>
                            <Group>
                                <Text>+{character.intelligence.save}</Text>
                                {character.proficiencies.includes('intelligence') && <Text size='xs'>(Proficient)</Text>}
                            </Group>
                            <Group>
                                <Text>+{character.wisdom.save}</Text>
                                {character.proficiencies.includes('wisdom') && <Text size='xs'>(Proficient)</Text>}
                            </Group>
                            <Group>
                                <Text>+{character.charisma.save}</Text>
                                {character.proficiencies.includes('charisma') && <Text size='xs'>(Proficient)</Text>}
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Group>
                        <Text>Armor Class:</Text>
                        <Text>{character.ac}</Text>
                    </Group>
                    <Group>
                        <Text>Initiative:</Text>
                        <Text>+{character.initiative}</Text>
                    </Group>
                    <Group>
                        <Text>Speed:</Text>
                        <Text>{character.speed}</Text>
                    </Group>
                    <Group>
                        <Text>Perception:</Text>
                        <Text>{character.perception}</Text>
                    </Group>
                    <Group>
                        <Text>Proficiency Bonus:</Text>
                        <Text>+{character.proficiency_bonus}</Text>
                    </Group>
                    <Group>
                        <Text>Spell Attack Mod:</Text>
                        <Text>+{character.spell_attack_mod}</Text>
                    </Group>
                    <Group>
                        <Text>Spell Save DC:</Text>
                        <Text>{character.spell_save_dc}</Text>
                    </Group>
                    <Group>
                        <Text>Concentration Check:</Text>
                        <Text>+{character.concentration}</Text>
                    </Group>
                </Grid.Col>
            </Grid>
            <Space h="lg" />
            <Group>
                <Title order={3}>Attacks</Title>
                <Button>Add Attack</Button>
            </Group>
            <Text>Attacks Per Turn: {2}</Text>
            <Grid>
                <Grid.Col span={3}>
                    <Text td="underline">Attack</Text>
                </Grid.Col>
                <Grid.Col span={2}>
                    <Text td="underline">Bonus</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Text td="underline">Damage & Notes (simple weapons)</Text>
                </Grid.Col>
            </Grid>
            {attackRows}
            <AttackForm opened={attackModalOpen} onClose={closeAttackForm} />
            <Space h="lg" />
            <Group>
                <Title order={3}>HP and Abilities</Title>
            </Group>
            <Grid>
                <Grid.Col span={3}>
                    <Text>Hit Points: {character.total_hitpoints}</Text>
                    <Text>Current Hit Points: {character.current_hitpoints} [{character.injury_condition}]</Text>
                </Grid.Col>
                <Grid.Col span={3}>
                    <Text>Temporary Hit Points: 0</Text>
                </Grid.Col>
                <Grid.Col span={4}>
                    <Text>Rest Recovery ({character.hit_die} + {character.constitution.modifier}): 5</Text>
                    <Space h="lg" />
                    <Text>Abilities go here (some need counters)</Text>
                </Grid.Col>
            </Grid>
            <Space h="lg" />
            <Group>
                <Title order={3}>Current Spells: {currentSpellList && currentSpellList.name}</Title>
                <NativeSelect
                    variant="unstyled"
                    data={['Set Current list', ...spellListOptions]}
                    value={currentSpellList && currentSpellList.id}
                    onChange={selectSpellList}
                />
                <Button onClick={() => setSpellListFormOpen(true)}>Add Spell List</Button>
            </Group>
            <Space h="lg" />
            {currentSpellList && <SpellTable spells={currentSpellList.spells} />}
            <SpellListForm characterId={character.id} open={spellListFormOpen} setOpen={setSpellListFormOpen} onSubmit={addSpellList} />
        </>
    )
}

export default CharacterDisplay