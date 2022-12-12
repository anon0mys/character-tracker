import React, { useEffect, useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { Client, ISpellListType, ISpellType } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface Props {
    spellList: ISpellListType
    open: boolean
    setOpen: Function
}

const SpellListModal = ({spellList, open, setOpen}: Props) => {
    const [spells, setSpells] = useState<ISpellType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        const path = `/characters/${spellList.character_id}/spell_lists/${spellList.id}`
        client.get({ path: path, token: auth.getToken() })
            .then(response => setSpells(response.data.spells))
            .catch(error => errors.setError(error))
    }, [])

    const spellsDisplay = spells.map(spell => {
        return <li>{spell.name}</li>
    })

    return (
        <Modal
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{spellList.name}</Modal.Header>
            <Modal.Content>
                <ul>
                    {spellsDisplay}
                </ul>
            </Modal.Content>
        </Modal>
    )
}

export default SpellListModal