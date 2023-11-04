import React, { useState } from 'react'
import { ISpellType } from '../../Api'
import { Table } from '@mantine/core'


interface SpellRowProps {
    spell: ISpellType
    openModal: (spell: any) => any
}

const SpellRow = ({ spell, openModal }: SpellRowProps) => {
    return (
        <Table.Tr key={spell.id} onClick={e => openModal(spell)}>
            <Table.Td>{spell.name}</Table.Td>
            <Table.Td>{spell.level}</Table.Td>
            <Table.Td>{spell.school}</Table.Td>
            <Table.Td>{spell.casting_time}</Table.Td>
            <Table.Td>{spell.range}</Table.Td>
            <Table.Td>{spell.archetypes.join(', ')}</Table.Td>
        </Table.Tr>
    )
}

export default SpellRow