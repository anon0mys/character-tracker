import React, { useState, useEffect } from 'react'
import { Header } from 'semantic-ui-react'
import { useAuth } from '../Auth'
import { Client, ISpellType, IPaginationType } from '../Api'
import { useError } from '../Errors'
import { archetypes, spellLevels, schools } from '../Api'
import useFilter from '../Hooks/useFilter'
import {
    Autocomplete, Box, Button, Flex,
    Loader, Pagination, rem, Menu
} from '@mantine/core'
import { IconSearch, IconX } from '@tabler/icons-react'
import SpellTable from '../Components/Spells/SpellTable'

const Spells = () => {
    const [spells, setSpells] = useState<[ISpellType] | []>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState<IPaginationType>({
        data: [],
        pages: 0,
    })
    const [search, setSearch] = useState('')
    const [archetypeFilters, archetypeMenuItems] = useFilter(archetypes)
    const [levelFilters, levelMenuItems] = useFilter(spellLevels)
    const [schoolFilters, schoolMenuItems] = useFilter(schools)
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
            {loading ? <Box maw={125} m='auto'><Loader color="blue" /></Box> :
                <>
                    <SpellTable spells={spells} />
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