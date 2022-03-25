import React, { useState } from 'react'
import AddSpellModal from '../spellLists/AddSpellModal'
import { Button, Grid } from '../elements'

const SpellRow = ({spell, inList}) => {
    const [modalDisplayed, setModalDisplayed] = useState(false)
    const buttonText = inList ? 'Remove from List' : 'Add to List'

    const toggleModal = () => {
        setModalDisplayed(!modalDisplayed)
    }

    return (
        <Grid gridTemplateColumns='1fr 2fr 1fr 1fr 1fr 2fr 1fr 1fr 1fr'>
            <span>{spell.name}</span>
            <span>{spell.archetypes}</span>
            <span>{spell.level}</span>
            <span>{spell.school}</span>
            <span>{spell.casting_time}</span>
            <span>{spell.range}</span>
            <span>{spell.duration}</span>
            <span>{spell.components}</span>
            <Button onClick={toggleModal}>{buttonText}</Button>
            <AddSpellModal
                displayed={modalDisplayed}
                close={toggleModal}
                spellId={spell.id}
            />
        </Grid>
    )
}

export default SpellRow