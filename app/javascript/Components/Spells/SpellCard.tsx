import React, { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter, CardDescription } from '../ui'
import { Separator } from '../ui'
import { ISpellType } from '../../Api'
import SpellModal from './SpellModal'

interface SpellCardProps {
    spell: ISpellType
}

const SpellCard = ({ spell }: SpellCardProps) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Card key={spell.id} onClick={() => setIsOpen(true)} className="cursor-pointer hover:border-primary/50 transition-all duration-300 border-2 border-primary/20 bg-card/80 backdrop-blur-sm hover:neon-glow group overflow-hidden">
                <CardHeader className="pb-3">
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors text-neon-cyan">{spell.name}</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-primary/20 text-primary rounded-md text-xs font-semibold neon-glow">
                            Level {spell.level}
                        </span>
                        <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                            {spell.school}
                        </span>
                    </div>
                </CardContent>
                <Separator />
                <CardFooter className="pt-3">
                    <p className="text-xs text-muted-foreground line-clamp-2">{spell.archetypes.join(', ')}</p>
                </CardFooter>
            </Card>
            <SpellModal spell={spell} opened={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}

export default SpellCard