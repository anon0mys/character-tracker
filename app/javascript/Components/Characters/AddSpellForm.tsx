import React, { useEffect, useState } from 'react'
import { Button } from '../ui'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog'
import { Label } from '../ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui'
import { Check } from 'lucide-react'
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
        const char = characters.find(ch => ch.id === value)
        if (char) {
            setSelectedCharacterId(value)
            setSelectedSpellListId('')
            fetchSpellLists(char.id)
        }
    }

    const pickSpellList = (value: string) => {
        const spellList = spellLists.find(sp => sp.id === value)
        if (spellList) {
            setSelectedSpellListId(value)
        }
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Spell to List</DialogTitle>
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
                                    <SelectItem key={ch.id} value={ch.id}>
                                        {ch.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedCharacterId && (
                        <div className="space-y-2">
                            <Label htmlFor="spellList">Spell List</Label>
                            <Select value={selectedSpellListId} onValueChange={pickSpellList}>
                                <SelectTrigger id="spellList">
                                    <SelectValue placeholder="Select a spell list" />
                                </SelectTrigger>
                                <SelectContent>
                                    {spellLists.map(sp => (
                                        <SelectItem key={sp.id} value={sp.id}>
                                            {sp.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button
                        disabled={missingData}
                        onClick={submit}
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