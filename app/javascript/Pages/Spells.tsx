import React, { useState, useEffect, useRef } from 'react'
import { Card, Checkbox, Container, Grid, Header, Label, Pagination, Search } from 'semantic-ui-react'
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

    const spellCards = spells.map(spell => {
        return <SpellCard key={spell.id} spell={spell} />
    })

    const archetypeLables = archetypes.map(archetype => <ButtonToggle key={archetype} onClick={() => archetypeFiltersChange(archetype)}>{archetype}</ButtonToggle>)
    const levelLables = spellLevels.map(level => <ButtonToggle key={level} onClick={() => levelFiltersChange(level)}>{level}</ButtonToggle>)
    const schoolLables = schools.map(school => <ButtonToggle key={school} onClick={() => schoolFiltersChange(school)}>{school}</ButtonToggle>)

    return (
        <>
            <Header size='large'>Spells</Header>
            <Grid>
                <Grid.Column>
                    <Search
                        loading={loading}
                        placeholder='Search...'
                        onSearchChange={handleSearchChange}
                        resultRenderer={undefined}
                        showNoResults={false}
                        value={search}
                    />
                </Grid.Column>
                <Grid.Column>
                    {archetypeLables}
                </Grid.Column>
                <Grid.Column>
                    {levelLables}
                </Grid.Column>
                <Grid.Column>
                    {schoolLables}
                </Grid.Column>
            </Grid>
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