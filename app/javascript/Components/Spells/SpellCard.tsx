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
            <Card key={spell.id} onClick={() => setIsOpen(true)} className="cursor-pointer hover:bg-accent transition-colors">
                <CardHeader>
                    <h3 className="text-lg font-semibold">{spell.name}</h3>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1 text-sm italic">
                        <p>Level {spell.level}</p>
                        <p>{spell.school}</p>
                    </div>
                </CardContent>
                <Separator />
                <CardFooter>
                    <p className="text-sm italic">{spell.archetypes.join(', ')}</p>
                </CardFooter>
            </Card>
            <SpellModal spell={spell} opened={isOpen} onClose={() => setIsOpen(false)} />
        </>
    )
}

export default SpellCard