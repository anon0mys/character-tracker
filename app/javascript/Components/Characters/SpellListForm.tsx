import React, { useState } from 'react'
import { Button, Input, Label } from '../ui'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'
import { Client } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface SpellListFormProps {
    characterId?: string
    open: boolean
    setOpen: (open: boolean) => void
    onSubmit: (data: any) => void
}

const SpellListForm = ({ characterId, open, setOpen, onSubmit }: SpellListFormProps) => {
    const [name, setName] = useState('')
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const submit = (event: React.FormEvent) => {
        event.preventDefault()
        client.post({
            path: `/characters/${characterId}/spell_lists`, payload: {
                name: name,
            }, token: auth.getToken()
        })
            .then(response => {
                onSubmit(response.data)
                setOpen(false)
                setName('')
            })
            .catch(error => errors.setError(error))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Spell List</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                id="name"
                                placeholder='name' 
                                value={name}
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Spell List</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default SpellListForm