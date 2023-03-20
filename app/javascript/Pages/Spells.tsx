import React, { useState, useEffect, useRef } from 'react'
import { Header, Pagination, Search } from 'semantic-ui-react'
import {
    Box, Button, Menu, MenuButton, MenuList,
    SimpleGrid, Wrap
} from '@chakra-ui/react'
import { useAuth } from '../Auth'
import { Client, ISpellType, IPaginationType } from '../Api'
import { useError } from '../Errors'
import { SpellCard } from '../Components/Spells'
import { archetypes, spellLevels, schools } from '../Api'
import useFilter from '../Hooks/useFilter'

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
    const [archetypeFilters, archetypeMenuItems] = useFilter(archetypes)
    const [levelFilters, levelMenuItems] = useFilter(spellLevels)
    const [schoolFilters, schoolMenuItems] = useFilter(schools)
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

    const spellCards = spells.map(spell => {
        return <SpellCard key={spell.id} spell={spell} />
    })

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
                        <MenuList>{archetypeMenuItems}</MenuList>
                    </Menu>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button}>
                            Level
                        </MenuButton>
                        <MenuList>{levelMenuItems}</MenuList>
                    </Menu>
                    <Menu closeOnSelect={false}>
                        <MenuButton as={Button}>
                            School
                        </MenuButton>
                        <MenuList>{schoolMenuItems}</MenuList>
                    </Menu>
                </Wrap>
            </SimpleGrid>
            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(290px, 1fr))'>
                {spellCards}
            </SimpleGrid>
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