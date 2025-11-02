import React, { useState } from 'react'
import { Button, Input, Label } from '../ui'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'

interface GameFormProps {
    open: boolean
    setOpen: (open: boolean) => void
    onSubmit: (attrs: {name: string, description: string, start_date?: string}) => Promise<any>
}

const GameForm = ({ open, setOpen, onSubmit }: GameFormProps) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [startDate, setStartDate] = useState<string | undefined>()

    const submit = (event: React.FormEvent) => {
        event.preventDefault()
        const attrs: {name: string, description: string, start_date?: string} = {
            name: name,
            description: description
        }
        if (startDate) {
            attrs['start_date'] = startDate
        }
        onSubmit(attrs)
        .then(response => {
            setOpen(false)
            setName('')
            setDescription('')
            setStartDate(undefined)
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a Game</DialogTitle>
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
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input 
                                id="description"
                                placeholder='description' 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input 
                                id="startDate"
                                type='date' 
                                placeholder='Start Date' 
                                value={startDate || ''}
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Create Game</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default GameForm