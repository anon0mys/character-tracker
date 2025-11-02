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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Characters</h1>
                <Button asChild>
                    <Link to='/characters/create'>Create Character</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characterCards}
            </div>
        </>
    )
}

export default Characters