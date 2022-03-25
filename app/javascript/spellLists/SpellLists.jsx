import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Flex } from '../elements'

const SpellLists = ({characterId, spellLists}) => {
    const navigate = useNavigate()

    const showSpellList = (id) => {
        navigate(`/characters/${characterId}/spell-lists/${id}`)
    }

    const spellListRows = spellLists.map(spellList => {
        return (
            <div key={spellList.id} onClick={() => showSpellList(spellList.id)}>
                {spellList.name}
            </div>
        )
    })

    return (
        <Flex flexDirection='column'>
            {spellListRows}
        </Flex>
    )
}

export default SpellLists