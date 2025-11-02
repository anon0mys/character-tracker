import React, { useState } from 'react'
import { ISpellType } from '../../Api'
import { AddSpellForm } from '../Characters'
import { Button } from '../ui'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../ui/dialog'
import { Check } from 'lucide-react'

interface SpellModalProps {
    spell?: ISpellType
    opened: boolean
    onClose: VoidFunction
}

const SpellModal = ({ spell, opened, onClose }: SpellModalProps) => {
    const [spellListModalOpen, setSpellListModalOpen] = useState(false);

    const onSubmit = () => {
        onClose()
    }

    if (!spell) return null

    return (
        <>
            <Dialog open={opened} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{spell.name}</DialogTitle>
                        <DialogDescription>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                <span>School: {spell.school}</span>
                                <span>Level: {spell.level}</span>
                                <span>Archetypes: {spell.archetypes.join(', ')}</span>
                                <span>Casting Time: {spell.casting_time}</span>
                                <span>Duration: {spell.duration}</span>
                                <span>Components: {spell.components}</span>
                                <span>Range: {spell.range}</span>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-muted-foreground">{spell.description}</p>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => setSpellListModalOpen(true)}>
                            <Check className="mr-2 h-4 w-4" />
                            Add to spell list
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <AddSpellForm spell={spell} opened={spellListModalOpen} onClose={() => setSpellListModalOpen(false)} onSubmit={onSubmit} />
        </>
    )
}

export default SpellModal