import React, { useEffect, useState } from 'react'
import useClient from '../Client'
import { useAuth } from '../auth/AuthContext'
import { Grid } from '../elements'
import CharacterCard from './CharacterCard'

const Characters = () => {
    const auth = useAuth()
    const client = useClient()
    const [ characters, setCharacters ] = useState([])

    useEffect(() => {
        client.Get('/characters', {token: auth.token})
        .then(data => {
            setCharacters(data.characters)
        })
    }, [])

    const characterCards = characters.map(character => {
        return <CharacterCard key={character.id} character={character} />
    })

    return (
        <div>
            <h3>Your Characters</h3>
            <Grid gridTemplateColumns='1fr'>
                {characterCards.length ? characterCards : <span>You don't have any characters yet</span>}
            </Grid>
        </div>
    )
}

export default Characters