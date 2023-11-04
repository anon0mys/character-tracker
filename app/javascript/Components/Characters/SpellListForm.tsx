import React, { useState } from 'react'
import { Button, Grid, Input, Modal } from 'semantic-ui-react'
import { Client } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface SpellListFormProps {
    characterId?: string
    open: boolean
    setOpen: Function
    onSubmit: Function
}

const SpellListForm = ({ characterId, open, setOpen, onSubmit }: SpellListFormProps) => {
    const [name, setName] = useState('')
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const submit = (event) => {
        event.preventDefault()
        client.post({
            path: `/characters/${characterId}/spell_lists`, payload: {
                name: name,
            }, token: auth.getToken()
        })
            .then(response => {
                onSubmit(response.data)
                setOpen(false)
            })
            .catch(error => errors.setError(error))
    }

    return (
        <Modal
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>Create a SpellList</Modal.Header>
            <Modal.Content image>
                <Grid>
                    <Grid.Row>
                        <Input placeholder='name' onChange={(e) => setName(e.target.value)} />
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    content="Create Spell List"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={submit}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export default SpellListForm