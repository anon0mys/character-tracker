import React, { useEffect, useState } from 'react'
import { Button, Grid, Input, Modal } from 'semantic-ui-react'
import { Client } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface GameFormProps {
    open: boolean
    setOpen: Function
    onSubmit: Function
}

const GameForm = ({ open, setOpen, onSubmit }: GameFormProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState<string | undefined>()
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const submit = (event) => {
        event.preventDefault()
        const attrs = {
            name: name,
            description: description
        }
        if (startDate) {
            attrs['start_date'] = startDate
        }
        onSubmit(attrs)
        .then(response => setOpen(false))
    }

    return (
        <Modal
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>Create a Character</Modal.Header>
            <Modal.Content image>
                <Grid>
                    <Grid.Row><Input placeholder='name' onChange={(e) => setName(e.target.value)}/></Grid.Row>
                    <Grid.Row><Input placeholder='description' onChange={(e) => setDescription(e.target.value)}/></Grid.Row>
                    <Grid.Row><Input type='date' placeholder='Start Date' onChange={(e) => setStartDate(e.target.value)}/></Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    content="Create Game"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={submit}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export default GameForm