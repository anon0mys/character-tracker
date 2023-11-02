import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button, Flex, Grid, Group, Space, Stack, Text, Title } from '@mantine/core';
import { Client, ICharacterType, ISpellListType } from '../Api';
import { useAuth } from '../Auth';
import { SpellListCard, SpellListForm } from '../Components/Characters';
import { useError } from '../Errors';

const CharacterDisplay = () => {
    const { id } = useParams()
    const [open, setOpen] = useState(false)
    const [spellLists, setSpellLists] = useState<ISpellListType[]>([])
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
        spell_attack_mod: 0,
        spell_save_dc: 0,
        concentration: 0,
        strength: {value: 10, modifier: 0, save: 0},
        dexterity: {value: 10, modifier: 0, save: 0},
        constitution: {value: 10, modifier: 0, save: 0},
        intelligence: {value: 10, modifier: 0, save: 0},
        wisdom: {value: 10, modifier: 0, save: 0},
        charisma: {value: 10, modifier: 0, save: 0},
    })
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        client.get({ path: `/characters/${id}`, token: auth.getToken() })
        .then(response => setCharacter(response.data))
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

    const spellListCards = spellLists.map(spellList => {
        return <SpellListCard key={spellList.id} spellList={spellList} />
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
                            <Space h="md" />
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
            <Grid>
                <Grid.Col span={4}><Title order={3}>Spell Lists</Title></Grid.Col>
                <Grid.Col span={2} offset={6}><Button onClick={() => setOpen(true)}>Add Spell List</Button></Grid.Col>
            </Grid>
            <Space h="lg" />
            <Flex>{spellListCards}</Flex>
            <SpellListForm characterId={character.id} open={open} setOpen={setOpen} onSubmit={addSpellList} />
        </>
    )
}

export default CharacterDisplay