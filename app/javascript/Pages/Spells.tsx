import React, { useState, useEffect, useRef } from 'react'
import { Card, Header, Pagination, Search } from 'semantic-ui-react'
import {
    Box, Button, Checkbox, Menu, MenuButton, MenuList, MenuItem,
    SimpleGrid, Switch, Wrap
} from '@chakra-ui/react'
import { useAuth } from '../Auth'
import { Client, ISpellType, IPaginationType } from '../Api'
import { useError } from '../Errors'
import { SpellCard } from '../Components/Spells'
import { ButtonToggle } from '../Components/Shared'
import { archetypes, spellLevels, schools } from '../Api'

const Spells = () => {
    const [spells, setSpells] = useState<[ISpellType] | []>([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState<IPaginationType>({
        data: [],
        pages: 0,
        page: null,
        next: null,
        prev: null
    })
    const [search, setSearch] = useState('')
    const [archetypeFilters, setArchetypeFilters] = useState<string[]>([])
    const [levelFilters, setLevelFilters] = useState<string[]>([])
    const [schoolFilters, setSchoolFilters] = useState<string[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()
    const timeoutRef = useRef<any>()

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

    const handlePageChange = (event, data) => {
        fetchSpells(data.activePage)
    }

    const handleSearchChange = (event, data) => {
        clearTimeout(timeoutRef.current)
        setSearch(data.value)

        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                fetchSpells()
                return
            }
            
            fetchSpells()
        }, 300)
    }

    const archetypeFiltersChange = (archetype) => {
        if (archetypeFilters.includes(archetype)) {
            let tempFilters = [...archetypeFilters]
            let index = tempFilters.indexOf(archetype)
            tempFilters.splice(index, 1)
            setArchetypeFilters(tempFilters)
        } else {
            setArchetypeFilters([...archetypeFilters, archetype])
        }
    }

    const levelFiltersChange = (level) => {
        if (levelFilters.includes(level)) {
            let tempFilters = [...levelFilters]
            let index = tempFilters.indexOf(level)
            tempFilters.splice(index, 1)
            setLevelFilters(tempFilters)
        } else {
            setLevelFilters([...levelFilters, level])
        }
    }

    const schoolFiltersChange = (school) => {
        if (schoolFilters.includes(school)) {
            let tempFilters = [...schoolFilters]
            let index = tempFilters.indexOf(school)
            tempFilters.splice(index, 1)
            setSchoolFilters(tempFilters)
        } else {
            setSchoolFilters([...schoolFilters, school])
        }
    }

    const buildMenuItem = (item, isActive, handleChange) => {
        return (
            <MenuItem
                as={ButtonToggle}
                key={item}
                isActive={isActive}
                onClick={() => handleChange(item)}
            >
                { item }
            </MenuItem >
        )
    }

    const spellCards = spells.map(spell => {
        return <SpellCard key={spell.id} spell={spell} />
    })

    const archetypeLables = archetypes.map(archetype => buildMenuItem(archetype, archetypeFilters.includes(archetype), archetypeFiltersChange))
    const levelLables = spellLevels.map(level => buildMenuItem(level, levelFilters.includes(level), levelFiltersChange))
    const schoolLables = schools.map(school => buildMenuItem(school, schoolFilters.includes(school), schoolFiltersChange))

    return (
        <>
            <Header size='large'>Spells</Header>
            <SimpleGrid columns={{ sm: 1, md: 5 }} py='20px'>
                <Box py='10px'>
                    <Search
                        loading={loading}
                        placeholder='Search...'
                        onSearchChange={handleSearchChange}
                        resultRenderer={undefined}
                        showNoResults={false}
                        value={search}
                    />
                </Box>
                <Wrap py={{ sm: '15px' }}>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button}>
                            Archetype
                        </MenuButton>
                        <MenuList>{archetypeLables}</MenuList>
                    </Menu>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button}>
                            Level
                        </MenuButton>
                        <MenuList>{levelLables}</MenuList>
                    </Menu>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button}>
                            School
                        </MenuButton>
                        <MenuList>{schoolLables}</MenuList>
                    </Menu>
                </Wrap>
            </SimpleGrid>
            <Card.Group>{spellCards}</Card.Group>
            <Pagination
                defaultActivePage={1}
                siblingRange={3}
                boundaryRange={0}
                ellipsisItem={null}
                totalPages={pagination.pages || 0}
                onPageChange={handlePageChange}
            />
        </>
    )
}

export default Spells