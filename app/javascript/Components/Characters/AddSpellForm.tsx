import React, { useEffect, useState } from 'react'
import { Button } from '../ui'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog'
import { Label, Input } from '../ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui'
import { Check, Plus, X } from 'lucide-react'
import { Client, ICharacterType, ISpellListType, ISpellType } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface AddSpellProps {
    spell?: ISpellType
    opened: boolean
    onClose: VoidFunction
    onSubmit: VoidFunction
}

const AddSpellForm = ({ spell, opened, onClose, onSubmit }: AddSpellProps) => {
    const [characters, setCharacters] = useState<ICharacterType[]>([])
    const [spellLists, setSpellLists] = useState<ISpellListType[]>([])
    const [selectedCharacterId, setSelectedCharacterId] = useState<string>('')
    const [selectedSpellListId, setSelectedSpellListId] = useState<string>('')
    const [showCreateList, setShowCreateList] = useState(false)
    const [newListName, setNewListName] = useState('')
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        client.get({ path: `/characters`, token: auth.getToken() })
            .then(response => setCharacters(response.data))
            .catch(error => errors.setError(error))
    }, [])

    const fetchSpellLists = (characterId: string) => {
        client.get({ path: `/characters/${characterId}/spell_lists`, token: auth.getToken() })
            .then(response => setSpellLists(response.data))
            .catch(error => errors.setError(error))
    }

    const pickCharacter = (value: string) => {
        // value is a string from Select, but ch.id might be a number, so we need to compare as strings
        const char = characters.find(ch => String(ch.id) === value)
        if (char) {
            setSelectedCharacterId(value)
            setSelectedSpellListId('')
            setShowCreateList(false)
            setNewListName('')
            fetchSpellLists(String(char.id))
        }
    }

    const pickSpellList = (value: string) => {
        // value is a string from Select, but sp.id is a number, so we need to compare as strings
        const spellList = spellLists.find(sp => String(sp.id) === value)
        if (spellList) {
            setSelectedSpellListId(value)
        }
    }

    const createNewList = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedCharacterId || !newListName.trim()) return

        client.post({
            path: `/characters/${selectedCharacterId}/spell_lists`,
            payload: { name: newListName.trim() },
            token: auth.getToken()
        })
            .then(response => {
                const newList = response.data
                setSpellLists([...spellLists, newList])
                setSelectedSpellListId(newList.id?.toString() || '')
                setShowCreateList(false)
                setNewListName('')
            })
            .catch(error => {
                // Error toast is automatically shown by Client.tsx
            })
    }

    const submit = () => {
        if (!selectedCharacterId || !selectedSpellListId) return
        
        const path = `/characters/${selectedCharacterId}/spell_lists/${selectedSpellListId}/add_spell`
        client.post({ path: path, token: auth.getToken(), payload: {spell: {id: spell && spell.id}}})
            .then(response => {
                // Success toast is automatically shown by Client.tsx
                onClose()
                onSubmit()
            })
            .catch(error => {
                // Error toast is automatically shown by Client.tsx
            })
    }

    const missingData = !selectedCharacterId || !selectedSpellListId

    return (
        <Dialog open={opened} onOpenChange={onClose}>
            <DialogContent className="border-primary/30 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-neon-cyan">Add Spell to List</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="character">Character</Label>
                        <Select value={selectedCharacterId} onValueChange={pickCharacter}>
                            <SelectTrigger id="character">
                                <SelectValue placeholder="Select a character" />
                            </SelectTrigger>
                            <SelectContent>
                                {characters.map(ch => (
                                    <SelectItem key={ch.id} value={String(ch.id || '')}>
                                        {ch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedCharacterId && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="spellList">Spell List</Label>
                                {!showCreateList && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowCreateList(true)}
                                        className="text-primary hover:text-primary/80 h-auto py-1"
                                    >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Create New List
                                    </Button>
                                )}
                            </div>
                            {showCreateList ? (
                                <div className="space-y-3 p-4 border border-primary/30 rounded-lg bg-card/50">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="newListName">New Spell List Name</Label>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setShowCreateList(false)
                                                setNewListName('')
                                            }}
                                            className="h-6 w-6 p-0"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <form onSubmit={createNewList} className="space-y-3">
                                        <Input
                                            id="newListName"
                                            placeholder="Enter spell list name"
                                            value={newListName}
                                            onChange={(e) => setNewListName(e.target.value)}
                                            className="h-9"
                                            autoFocus
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                type="submit"
                                                size="sm"
                                                className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
                                                disabled={!newListName.trim()}
                                            >
                                                Create
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setShowCreateList(false)
                                                    setNewListName('')
                                                }}
                                                className="border-primary/30"
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <Select value={selectedSpellListId} onValueChange={pickSpellList}>
                                    <SelectTrigger id="spellList">
                                        <SelectValue placeholder="Select a spell list" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {spellLists.length > 0 ? (
                                            spellLists.map(sp => (
                                                <SelectItem key={sp.id} value={sp.id?.toString() || ''}>
                                                    {sp.name}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                                                No spell lists found
                                            </div>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}
                </div>
                <DialogFooter className="border-t border-primary/20 pt-4">
                    <Button
                        disabled={missingData}
                        onClick={submit}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow disabled:opacity-50 disabled:neon-glow-none"
                    >
                        <Check className="mr-2 h-4 w-4" />
                        Add to List
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddSpellForm