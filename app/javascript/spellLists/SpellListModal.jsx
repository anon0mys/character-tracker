import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import useClient from '../Client'
import { Button, Form } from '../elements'

const SpellListModal = ({characterId, displayed, close, onSubmit}) => {
    const auth = useAuth()
    const client = useClient()
    const [ name, setName ] = useState()

    const createSpellList = (event) => {
        event.preventDefault()
        client.Post(`/characters/${characterId}/spell_lists`, {
            token: auth.token, 
            payload: { spell_list: { name: name } }
        })
        .then(data => {
            onSubmit(data)
            close()
        })
    }

    return (
        <div>
            <Form display={displayed ? '' : 'none'}>
                <input
                    type='text'
                    placeholder='Spell List Name'
                    onChange={event => setName(event.target.value)}
                />
                <Button onClick={createSpellList}>Create List</Button>
            </Form>
        </div>
    )
}

export default SpellListModal