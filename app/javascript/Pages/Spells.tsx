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
import { Search, X, Loader2, Trash2 } from 'lucide-react'
import SpellTable from '../Components/Spells/SpellTable'

const Spells = () => {
    const [spells, setSpells] = useState<[ISpellType] | []>([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState<IPaginationType>({
        data: [],
        pages: 0,
    })
    const [search, setSearch] = useState('')
    const [archetypeFilters, archetypeMenuItems, clearArchetypeFilters, removeArchetypeFilter] = useFilter(archetypes, 'spellFilters_archetype')
    const [levelFilters, levelMenuItems, clearLevelFilters, removeLevelFilter] = useFilter(spellLevels, 'spellFilters_level')
    const [schoolFilters, schoolMenuItems, clearSchoolFilters, removeSchoolFilter] = useFilter(schools, 'spellFilters_school')
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2 text-primary">Spells</h1>
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
            {/* Active Filters Display */}
            {(archetypeFilters.length > 0 || levelFilters.length > 0 || schoolFilters.length > 0) && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 border border-primary/30 rounded-lg bg-card/50">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                clearArchetypeFilters()
                                clearLevelFilters()
                                clearSchoolFilters()
                            }}
                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Clear All
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {archetypeFilters.map(filter => (
                            <div
                                key={`archetype-${filter}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/20 border border-primary/40 text-xs sm:text-sm"
                            >
                                <span className="text-primary/80 font-medium">Archetype:</span>
                                <span className="text-foreground capitalize">{filter}</span>
                                <X
                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground transition-colors ml-1"
                                    onClick={() => removeArchetypeFilter(filter)}
                                />
                            </div>
                        ))}
                        {levelFilters.map(filter => (
                            <div
                                key={`level-${filter}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/20 border border-primary/40 text-xs sm:text-sm"
                            >
                                <span className="text-primary/80 font-medium">Level:</span>
                                <span className="text-foreground capitalize">{filter}</span>
                                <X
                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground transition-colors ml-1"
                                    onClick={() => removeLevelFilter(filter)}
                                />
                            </div>
                        ))}
                        {schoolFilters.map(filter => (
                            <div
                                key={`school-${filter}`}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/20 border border-primary/40 text-xs sm:text-sm"
                            >
                                <span className="text-primary/80 font-medium">School:</span>
                                <span className="text-foreground capitalize">{filter}</span>
                                <X
                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground transition-colors ml-1"
                                    onClick={() => removeSchoolFilter(filter)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
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