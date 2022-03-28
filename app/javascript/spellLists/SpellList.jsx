import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import useClient from '../Client'
import { Flex } from '../elements'
import SpellCard from '../spells/SpellCard'

const SpellList = () => {
    const params = useParams()
    const auth = useAuth()
    const client = useClient()
    const navigate = useNavigate()
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

    const spellCards = spells.map(spell => {
        return <SpellCard key={spell.id} spell={spell} inList={true} handleClick={removeSpell}/>
    })

    return (
        <div>
            <h2>Spell List: {name}</h2>
            <h3 onClick={() => navigate(`/characters/${params.characterId}`)}>Back</h3>
            <Flex flexDirection='column'>
                {spellCards}
            </Flex>
        </div>
    )
}

export default SpellList