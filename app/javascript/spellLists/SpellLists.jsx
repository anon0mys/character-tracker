import React from 'react'
import { Link } from 'react-router-dom'
import { Flex } from '../elements'

const SpellLists = ({characterId, spellLists}) => {
    const spellListRows = spellLists.map(spellList => {
        return (
            <Link
                key={spellList.id}
                to={`/characters/${characterId}/spell-lists/${spellList.id}`}
            >
                {spellList.name}
            </Link>
        )
    })

    return (
        <Flex flexDirection='column'>
            {spellListRows}
        </Flex>
    )
}

export default SpellLists