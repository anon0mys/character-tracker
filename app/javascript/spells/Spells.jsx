import React, { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import useClient from '../Client'
import { Flex, Grid } from '../elements'
import SpellRow from './SpellRow'
import SpellCard from './SpellCard'

const Spells = () => {
    const auth = useAuth()
    const client = useClient()
    const [ spells, setSpells ] = useState([])

    useEffect(() => {
        client.Get('/spells', {token: auth.token})
        .then(data => setSpells(data.spells))
    }, [])

    const spellRows = spells.map(spell => {
        return <SpellCard key={spell.id} spell={spell} />
    })

    return (
        <>
            <h2>Spells</h2>
            <Flex flexWrap='wrap'>
                {spellRows}
            </Flex>
        </>
    )
}

export default Spells