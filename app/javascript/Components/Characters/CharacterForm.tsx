import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Grid, Input, Modal } from 'semantic-ui-react'
import { Client } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'
import { archetypes } from '../../Api'

interface CharacterFormProps {
    open: boolean
    setOpen: Function
    onSubmit: Function
}

const CharacterForm = ({ open, setOpen, onSubmit }: CharacterFormProps) => {
    const [name, setName] = useState('')
    const [archetype, setArchetype] = useState('')
    const [games, setGames] = useState([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()
    const archetypeOptions = archetypes.map(archetype => {
        return {
            key: archetype,
            text: archetype,
            value: archetype,
        }
    })

    useEffect(() => {
        client.get({path: '/games', token: auth.getToken()})
        .then(response => {
            const gameOptions = response.data.map(game => {
                return {
                    key: game,
                    text: game,
                    value: game,
                }
            })
            setGames(gameOptions)
        })
    }, [games])

    const submit = (event) => {
        event.preventDefault()
        client.post({ path: '/characters', payload: {
            name: name,
            archetype: archetype
        }, token: auth.getToken() })
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
            <Modal.Header>Create a Character</Modal.Header>
            <Modal.Content image>
                <Grid>
                    <Grid.Row><Input placeholder='name' onChange={(e) => setName(e.target.value)}/></Grid.Row>
                    <Grid.Row>
                        <Dropdown
                            placeholder='Select Class'
                            search
                            selection
                            options={archetypeOptions}
                            onChange={(e) => setArchetype(e.target.textContent)}
                        />
                    </Grid.Row>
                    <Grid.Row>
                        <Dropdown
                            placeholder='Select Game'
                            search
                            selection
                            options={games}
                            onChange={(e) => setArchetype(e.target.textContent)}
                        />
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    content="Create Character"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={submit}
                    positive
                />
            </Modal.Actions>
        </Modal>
    )
}

export default CharacterForm