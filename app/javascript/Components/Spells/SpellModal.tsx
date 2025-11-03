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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-primary/30 bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl text-neon-cyan">{spell.name}</DialogTitle>
                        <DialogDescription>
                            <div className="flex flex-wrap gap-3 mt-3">
                                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-semibold">Level {spell.level}</span>
                                <span className="px-2 py-1 bg-muted rounded text-xs">{spell.school}</span>
                                <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">{spell.casting_time}</span>
                                <span className="px-2 py-1 bg-muted rounded text-xs">Range: {spell.range}</span>
                                <span className="px-2 py-1 bg-muted rounded text-xs">Duration: {spell.duration}</span>
                                <span className="px-2 py-1 bg-muted rounded text-xs">Components: {spell.components}</span>
                            </div>
                            <div className="mt-3 text-sm text-muted-foreground">
                                <span className="font-medium">Archetypes: </span>
                                <span>{spell.archetypes.join(', ')}</span>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 border-t border-primary/20">
                        <p className="text-sm leading-relaxed">{spell.description}</p>
                    </div>
                    <div className="flex justify-end border-t border-primary/20 pt-4">
                        <Button onClick={() => setSpellListModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
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