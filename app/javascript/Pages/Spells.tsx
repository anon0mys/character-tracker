import React, { useState, useEffect } from 'react'
import { Header } from 'semantic-ui-react'
import { useAuth } from '../Auth'
import { Client, ISpellType, IPaginationType } from '../Api'
import { useError } from '../Errors'
import { archetypes, spellLevels, schools } from '../Api'
import useFilter from '../Hooks/useFilter'
import {
    Autocomplete, Box, Button, Flex,
    Loader, Pagination, rem, Table, Menu
} from '@mantine/core'
import SpellRow from '../Components/Spells/SpellRow'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import SpellModal from '../Components/Spells/SpellModal'

const Spells = () => {
    const [spells, setSpells] = useState<[ISpellType] | []>([])
    const [currentSpell, setCurrentSpell] = useState<ISpellType>()
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState<IPaginationType>({
        data: [],
        pages: 0,
    })
    const [search, setSearch] = useState('')
    const [archetypeFilters, archetypeMenuItems] = useFilter(archetypes)
    const [levelFilters, levelMenuItems] = useFilter(spellLevels)
    const [schoolFilters, schoolMenuItems] = useFilter(schools)
    const [opened, handlers] = useDisclosure(false)
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const fetchSpells = (page: number = 1) => {
        setLoading(true)
        let path = `/spells?page=${page}`
        path = addFilters(path)
        client.get({ path: path, token: auth.getToken() })
            .then(response => {
                const {data, ...pagination} = response
                setSpells(data)
                setPagination(pagination)
                setLoading(false)
            })
            .catch(error => errors.setError(error))
    }

    const addFilters = (path: string) => {
        if (search) {
            path += `&name=${search}`
        }
        if (archetypeFilters.length) {
            path += `&archetype=${archetypeFilters.join(',')}`
        }
        if (levelFilters.length) {
            path += `&level=${levelFilters.join(',')}`
        }
        if (schoolFilters.length) {
            path += `&school=${schoolFilters.join(',')}`
        }
        return path
    }

    useEffect(() => {
        fetchSpells()
    }, [search, archetypeFilters, schoolFilters, levelFilters])

    const handlePageChange = (pageNumber: number) => {
        fetchSpells(pageNumber)
    }

    const handleSearchChange = (value: string) => {
        setSearch(value)
        fetchSpells()
    }

    const openModal = (spell) => {
        setCurrentSpell(spell)
        handlers.open()
    }

    const closeModal = () => {
        setCurrentSpell(undefined)
        handlers.close()
    }

    const rows = spells.map((spell: ISpellType) => <SpellRow key={spell.id} spell={spell} openModal={openModal} />);

    return (
        <>
            <Header size='large'>Spells</Header>
            <Flex py='20px' direction='row' gap="sm">
                <Autocomplete
                    placeholder="Search"
                    leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    rightSection={
                        search === '' ? '' : <IconX style={{ width: rem(16), height: rem(16)}} stroke={1.5} onClick={e => setSearch('')} />
                    }
                    visibleFrom="xs"
                    value={search}
                    onChange={handleSearchChange}
                />
                <Menu>
                    <Menu.Target>
                        <Button onClick={e => e.preventDefault()}>Archetype</Button>
                    </Menu.Target>
                    <Menu.Dropdown>{archetypeMenuItems}</Menu.Dropdown>
                </Menu>
                <Menu>
                    <Menu.Target>
                        <Button onClick={e => e.preventDefault()}>Level</Button>
                    </Menu.Target>
                    <Menu.Dropdown>{levelMenuItems}</Menu.Dropdown>
                </Menu>
                <Menu>
                    <Menu.Target>
                        <Button onClick={e => e.preventDefault()}>School</Button>
                    </Menu.Target>
                    <Menu.Dropdown>{schoolMenuItems}</Menu.Dropdown>
                </Menu>
            </Flex>
            {currentSpell && <SpellModal spell={currentSpell} opened={opened} onClose={closeModal} /> }
            {loading ? <Box maw={125} m='auto'><Loader color="blue" /></Box> :
                <>
                    <Table highlightOnHover mb={20}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Level</Table.Th>
                                <Table.Th>School</Table.Th>
                                <Table.Th>Casting Time</Table.Th>
                                <Table.Th>Range</Table.Th>
                                <Table.Th>Archetypes</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                    <Flex direction="row" justify="center">
                        <Pagination
                            siblings={3}
                            defaultValue={1}
                            value={pagination.page}
                            total={pagination.pages}
                            onChange={handlePageChange}
                        />
                    </Flex>
                </>
            }
        </>
    )
}

export default Spells