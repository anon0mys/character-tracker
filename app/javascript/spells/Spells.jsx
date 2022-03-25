import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import useClient from '../Client'
import { Flex, Grid } from '../elements'
import SpellRow from './SpellRow'

const Spells = () => {
    const auth = useAuth()
    const client = useClient()
    const [ spells, setSpells ] = useState([])

    useEffect(() => {
        client.Get('/spells', {token: auth.token})
        .then(data => setSpells(data.spells))
    }, [])


    const spellRows = spells.map(spell => {
        return <SpellRow key={spell.id} spell={spell} />
    })

    return (
        <>
            <h2>Spells</h2>
            <Flex flexDirection='column'>
                <Grid gridTemplateColumns='2fr 3fr 1fr 1fr 1fr 2fr 3fr 1fr 1fr'>
                    <span>Name</span>
                    <span>Archetypes</span>
                    <span>Level</span>
                    <span>School</span>
                    <span>Casting Time</span>
                    <span>Range</span>
                    <span>Duration</span>
                    <span>Components</span>
                </Grid>
                {spellRows}
            </Flex>
        </>
    )
}

export default Spells