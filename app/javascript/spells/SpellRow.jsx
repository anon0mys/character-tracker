import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import useClient from '../Client'
import AddSpellModal from '../spellLists/AddSpellModal'
import { Button, Grid } from '../elements'

const SpellRow = ({spell, inList}) => {
    const auth = useAuth()
    const client = useClient()
    const [modalDisplayed, setModalDisplayed] = useState(false)

    const toggleModal = () => {
        setModalDisplayed(!modalDisplayed)
    }

    const removeSpell = () => {
        console.log('REMOVE')
    }

    const button = inList ?
        <Button onClick={removeSpell}>Remove from List</Button>
        : <Button onClick={toggleModal}>Add to List</Button>

    return (
        <Grid gridTemplateColumns='2fr 3fr 1fr 1fr 1fr 2fr 3fr 1fr 1fr'>
            <span>{spell.name}</span>
            <span>{spell.archetypes}</span>
            <span>{spell.level}</span>
            <span>{spell.school}</span>
            <span>{spell.casting_time}</span>
            <span>{spell.range}</span>
            <span>{spell.duration}</span>
            <span>{spell.components}</span>
            {button}
            <AddSpellModal
                displayed={modalDisplayed}
                close={toggleModal}
                spellId={spell.id}
            />
        </Grid>
    )
}

export default SpellRow