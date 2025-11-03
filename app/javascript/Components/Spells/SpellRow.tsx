import React from 'react'
import { ISpellType } from '../../Api'
import { TableRow, TableCell } from '../ui'

interface SpellRowProps {
    spell: ISpellType
    openModal: (spell: ISpellType) => void
}

const SpellRow = ({ spell, openModal }: SpellRowProps) => {
    return (
        <TableRow 
            key={spell.id} 
            onClick={() => openModal(spell)} 
            className="cursor-pointer hover:bg-accent/50 transition-colors group"
        >
            <TableCell className="font-medium group-hover:text-primary transition-colors text-sm sm:text-base">{spell.name}</TableCell>
            <TableCell>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-semibold">
                    {spell.level}
                </span>
            </TableCell>
            <TableCell className="text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">{spell.school}</TableCell>
            <TableCell className="text-xs sm:text-sm hidden md:table-cell">{spell.casting_time}</TableCell>
            <TableCell className="text-xs sm:text-sm hidden lg:table-cell">{spell.range}</TableCell>
            <TableCell className="text-xs sm:text-sm text-muted-foreground line-clamp-1 hidden lg:table-cell">{spell.archetypes.join(', ')}</TableCell>
        </TableRow>
    )
}

export default SpellRow