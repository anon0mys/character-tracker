import React, { useState, useEffect } from 'react'
import { useAuth } from '../Auth'
import { Client, ISpellType, IPaginationType } from '../Api'
import { useError } from '../Errors'
import { archetypes, spellLevels, schools } from '../Api'
import useFilter from '../Hooks/useFilter'
import { Button, Input } from '../Components/ui'
import { 
    DropdownMenu, 
    DropdownMenuTrigger, 
    DropdownMenuContent 
} from '../Components/ui'
import { Search, X, Loader2 } from 'lucide-react'
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setSearch(value)
        fetchSpells()
    }

    const renderPagination = () => {
        if (!pagination.pages || pagination.pages <= 1) return null
        
        const pages = []
        const currentPage = pagination.page || 1
        const totalPages = pagination.pages
        
        // Calculate page range to show
        const siblings = 2
        let startPage = Math.max(1, currentPage - siblings)
        let endPage = Math.min(totalPages, currentPage + siblings)
        
        if (startPage > 1) {
            pages.push(
                <Button key={1} variant="outline" size="sm" onClick={() => handlePageChange(1)}>
                    1
                </Button>
            )
            if (startPage > 2) {
                pages.push(<span key="ellipsis-start" className="px-2">...</span>)
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <Button
                    key={i}
                    variant={i === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Button>
            )
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis-end" className="px-2">...</span>)
            }
            pages.push(
                <Button key={totalPages} variant="outline" size="sm" onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Button>
            )
        }
        
        return (
            <div className="flex flex-wrap justify-center items-center gap-2 mt-4 sm:mt-6 overflow-x-auto pb-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="min-h-[40px] shrink-0"
                >
                    Previous
                </Button>
                {pages}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="min-h-[40px] shrink-0"
                >
                    Next
                </Button>
            </div>
        )
    }

    return (
        <>
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2 text-neon-cyan">Spells</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Browse and search D&D spells</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search spells..."
                        value={search}
                        onChange={handleSearchChange}
                        className="pl-9 pr-9 h-10 sm:h-11 min-h-[44px]"
                    />
                    {search && (
                        <X 
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                            onClick={() => setSearch('')} 
                        />
                    )}
                </div>
                <div className="flex gap-2 sm:gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="shadow-sm min-h-[44px] flex-1 sm:flex-initial">Archetype</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>{archetypeMenuItems}</DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="shadow-sm min-h-[44px] flex-1 sm:flex-initial">Level</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>{levelMenuItems}</DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="shadow-sm min-h-[44px] flex-1 sm:flex-initial">School</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>{schoolMenuItems}</DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <SpellTable spells={spells} />
                    {renderPagination()}
                </>
            )}
        </>
    )
}

export default Spells