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
            <DialogContent className="sm:max-w-[500px] border-primary/30 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-primary">Create a Game</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">Start a new D&D campaign or adventure</p>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Game Name</Label>
                            <Input 
                                id="name"
                                placeholder='Enter game name' 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input 
                                id="description"
                                placeholder='Enter game description' 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="h-11"
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
                                className="h-11"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-primary/30">Cancel</Button>
                        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 ">Create Game</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default GameForm