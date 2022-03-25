import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import useClient from '../Client'
import { Flex } from '../elements'
import SpellRow from '../spells/SpellRow'

const SpellList = () => {
    const params = useParams()
    const auth = useAuth()
    const client = useClient()
    const [ name, setName ] = useState()
    const [ spells, setSpells ] = useState([])

    useEffect(() => {
        client.Get(`/characters/${params.characterId}/spell_lists/${params.id}`, {token: auth.token})
            .then(data => {
                setName(data.spell_list.name)
                setSpells(data.spell_list.spells)
            })
    }, [])

    const removeSpell = () => {

    }

    const spellRows = spells.map(spell => {
        return <SpellRow key={spell.id} spell={spell} inList={true} handleClick={removeSpell}/>
    })

    return (
        <div>
            <h2>Spell List: {name}</h2>
            <Flex flexDirection='column'>
                {spellRows}
            </Flex>
        </div>
    )
}

export default SpellList