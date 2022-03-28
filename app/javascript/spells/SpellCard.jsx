import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import useClient from '../Client'
import AddSpellModal from '../spellLists/AddSpellModal'
import { Button, Grid } from '../elements'

const SpellCard = ({spell, inList}) => {
    const auth = useAuth()
    const client = useClient()
    const navigate = useNavigate()
    const [modalDisplayed, setModalDisplayed] = useState(false)

    const toggleModal = (event) => {
        event.stopPropagation()
        setModalDisplayed(!modalDisplayed)
    }

    const removeSpell = () => {
        console.log('REMOVE')
    }

    const button = inList ?
        <Button onClick={removeSpell}>Remove from List</Button>
        : <Button onClick={toggleModal}>Add to List</Button>

    return (
        <Grid width={250} m={20} onClick={() => navigate('/')}>
            <span>Name: {spell.name}</span>
            <span>Level: {spell.level}</span>
            <span>School: {spell.school}</span>
            <span>Archetypes: {spell.archetypes.join(', ')}</span>
            {button}
            <AddSpellModal
                displayed={modalDisplayed}
                close={toggleModal}
                spellId={spell.id}
            />
        </Grid>
    )
}

export default SpellCard