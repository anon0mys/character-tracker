import React from 'react'
import { Modal } from 'semantic-ui-react'
import { ISpellType } from '../../Api'

interface SpellModalProps {
    spell: ISpellType
    open: boolean
    setOpen: Function
}

const SpellModal = ({spell, open, setOpen}: SpellModalProps) => {
    return (
        <Modal
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{spell.name}</Modal.Header>
            <Modal.Content>
                <p>School: {spell.school}</p>
                <p>Level: {spell.level}</p>
                <p>Archetypes: {spell.archetypes.join(', ')}</p>
                <p>Casting Time: {spell.casting_time}</p>
                <p>Duration: {spell.duration}</p>
                <p>Components: {spell.components}</p>
                <p>Range: {spell.range}</p>
            </Modal.Content>
            <Modal.Content>
                {spell.description}
            </Modal.Content>
        </Modal>
    )
}

export default SpellModal