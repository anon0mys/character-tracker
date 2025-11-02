import React from 'react'
import { ISpellType } from '../../Api'
import { TableRow, TableCell } from '../ui'

interface SpellRowProps {
    spell: ISpellType
    openModal: (spell: ISpellType) => void
}

const SpellRow = ({ spell, openModal }: SpellRowProps) => {
    return (
        <TableRow key={spell.id} onClick={() => openModal(spell)} className="cursor-pointer hover:bg-accent">
            <TableCell>{spell.name}</TableCell>
            <TableCell>{spell.level}</TableCell>
            <TableCell>{spell.school}</TableCell>
            <TableCell>{spell.casting_time}</TableCell>
            <TableCell>{spell.range}</TableCell>
            <TableCell>{spell.archetypes.join(', ')}</TableCell>
        </TableRow>
    )
}

export default SpellRow