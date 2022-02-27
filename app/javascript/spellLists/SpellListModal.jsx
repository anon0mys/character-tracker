import React, { useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import useClient from '../Client'

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

    const spellListForm = displayed ? (
        <form>
            <input
                type='text'
                placeholder='Spell List Name'
                onChange={event => setName(event.target.value)}
            />
            <button onClick={createSpellList}>Create List</button>
        </form>
    ) : <></>

    return (
        <div>
            {spellListForm}
        </div>
    )
}

export default SpellListModal