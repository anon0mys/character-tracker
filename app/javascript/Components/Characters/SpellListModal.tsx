import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Client, ISpellListType, ISpellType } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface Props {
    spellList: ISpellListType
    open: boolean
    setOpen: (open: boolean) => void
}

const SpellListModal = ({spellList, open, setOpen}: Props) => {
    const [spells, setSpells] = useState<ISpellType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        if (open) {
            const path = `/characters/${spellList.character_id}/spell_lists/${spellList.id}`
            client.get({ path: path, token: auth.getToken() })
                .then(response => setSpells(response.data.spells))
                .catch(error => errors.setError(error))
        }
    }, [open])

    const spellsDisplay = spells.map((spell, index) => {
        return <li key={spell.id || index}>{spell.name}</li>
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="border-primary/30 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-neon-cyan">{spellList.name}</DialogTitle>
                </DialogHeader>
                <div className="py-4 border-t border-primary/20">
                    <ul className="space-y-2">
                        {spellsDisplay.length > 0 ? spellsDisplay : <li className="text-muted-foreground text-center py-4">No spells in this list</li>}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SpellListModal