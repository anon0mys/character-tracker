import React, { createContext, useContext, useState } from 'react'
import { Client, IPaginationType, ISpellType } from '../../Api';
import { useAuth } from '../../Auth';
import { useError } from '../../Errors';

interface SpellsContextType {
    spells: ISpellType[];
    pagination: IPaginationType | {};
    setPage: (newPage: number, callback: VoidFunction) => void;
    search: (searchTerm: string, callback: VoidFunction) => void;
    filterByArchetype: (filter: string, callback: VoidFunction) => void;
    filterBySchool: (filter: string, callback: VoidFunction) => void;
    filterByLevel: (filter: string, callback: VoidFunction) => void;
}

const SpellsContext = createContext<SpellsContextType>(null!);


const SpellsProvider = ({ children }: { children: React.ReactNode }) => {
    const [spells, setSpells] = useState([])
    const [pagination, setPagination] = useState<IPaginationType>({
        data: [],
        pages: 0,
        page: undefined,
        next: undefined,
        prev: undefined
    })
    const [searchTerm, setSearchTerm] = useState<string | null>(null)
    const [archetypeFilters, setArchetypeFilters] = useState<string[]>([])
    const [levelFilters, setLevelFilters] = useState<string[]>([])
    const [schoolFilters, setSchoolFilters] = useState<string[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const fetchSpells = (callback: VoidFunction, page = 1) => {
        let path = `/spells?page=${page}`
        path = addFilters(path)
        client.get({ path: path, token: auth.getToken() })
            .then(response => {
                const { data, ...pagination } = response
                setSpells(data)
                setPagination(pagination)
                callback()
            })
            .catch(error => errors.setError(error))
    }

    const addFilters = (path: string) => {
        if (searchTerm) {
            path += `&name=${searchTerm}`
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

    const setPage = (newPage: number, callback: VoidFunction) => {
        fetchSpells(callback, newPage)
    }

    const search = (searchTerm: string, callback: VoidFunction) => {
        setSearchTerm(searchTerm)
        fetchSpells(callback)
    }

    const filterByArchetype = (filter: string, callback: VoidFunction) => {
        if (archetypeFilters.includes(filter)) {
            let index = archetypeFilters.indexOf(filter)
            setArchetypeFilters(archetypeFilters.splice(index, 1))
        } else {
            setArchetypeFilters([...archetypeFilters, filter])
        }
        fetchSpells(callback)
    }

    const filterByLevel = (filter: string, callback: VoidFunction) => {
        if (levelFilters.includes(filter)) {
            let index = levelFilters.indexOf(filter)
            setLevelFilters(levelFilters.splice(index, 1))
        } else {
            setLevelFilters([...levelFilters, filter])
        }
        fetchSpells(callback)
    }

    const filterBySchool = (filter: string, callback: VoidFunction) => {
        if (schoolFilters.includes(filter)) {
            let index = schoolFilters.indexOf(filter)
            setSchoolFilters(schoolFilters.splice(index, 1))
        } else {
            setSchoolFilters([...schoolFilters, filter])
        }
        fetchSpells(callback)
    }

    const context = {
        spells, pagination, setPage, search,
        filterByArchetype, filterByLevel, filterBySchool
    }

    return <SpellsContext.Provider value={context}>{children}</SpellsContext.Provider>
}

const useSpellsContext = () => {
    return useContext(SpellsContext)
}

export { SpellsProvider, useSpellsContext }