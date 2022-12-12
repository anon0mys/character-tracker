import React, { useState } from 'react'
import { Button, Modal } from 'semantic-ui-react'
import { ISpellType } from '../../Api'
import { AddSpellForm } from '../Characters'

interface SpellModalProps {
    spell: ISpellType
    open: boolean
    setOpen: Function
}

const SpellModal = ({spell, open, setOpen}: SpellModalProps) => {
    const [addSpellOpen, setAddSpellOpen] = useState(false)

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
            <Modal.Actions>
                <Button
                    content="Add to spell list"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => setAddSpellOpen(true)}
                    positive
                />
            </Modal.Actions>

            <AddSpellForm spell={spell} open={addSpellOpen} setOpen={setAddSpellOpen} />
        </Modal>
    )
}

export default SpellModal