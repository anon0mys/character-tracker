import React, { useEffect, useState } from 'react'
import { Button } from '../Components/ui'
import { useAuth } from '../Auth'
import { useError } from '../Errors'
import { Client, ICharacterType } from '../Api'
import { CharacterCard } from '../Components/Characters'
import { Link } from 'react-router-dom'

const Characters = () => {
    const [characters, setCharacters] = useState<ICharacterType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const fetchCharacters = () => {
        client.get({ path: '/characters', token: auth.getToken() })
            .then(response => setCharacters(response.data))
            .catch(error => errors.setError(error))
    }

    useEffect(() => {
        fetchCharacters()
    }, [])

    const deleteCharacter = () => {
        fetchCharacters()
    }

    const characterCards = characters.map(character => {
        return <CharacterCard key={character.id} character={character} deleteCharacter={deleteCharacter}/>
    })

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2 text-neon-cyan">Characters</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Create and manage your D&D characters</p>
                </div>
                <Button asChild size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 neon-glow min-h-[44px]">
                    <Link to='/characters/create'>Create Character</Link>
                </Button>
            </div>
            {characterCards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {characterCards}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="text-center space-y-4">
                        <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                            <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-1">No characters yet</h3>
                            <p className="text-muted-foreground mb-4">Create your first character to get started</p>
                            <Button asChild>
                                <Link to='/characters/create'>Create Your First Character</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Characters