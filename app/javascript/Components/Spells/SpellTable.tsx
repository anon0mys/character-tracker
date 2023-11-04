import React, { useState } from 'react'
import { Table } from "@mantine/core"
import { ISpellType } from '../../Api';
import SpellRow from './SpellRow';
import { useDisclosure } from '@mantine/hooks';
import SpellModal from './SpellModal';

interface SpellTableProps {
    spells: ISpellType[]
}

const SpellTable = ({spells}: SpellTableProps) => {
    const [currentSpell, setCurrentSpell] = useState<ISpellType>()
    const [opened, handlers] = useDisclosure(false)
    const openModal = (spell) => {
        setCurrentSpell(spell)
        handlers.open()
    }

    const closeModal = () => {
        setCurrentSpell(undefined)
        handlers.close()
    }

    const rows = spells.map((spell: ISpellType) => <SpellRow key={spell.id} spell={spell} openModal={openModal} />);

    return (
        <>
            <Table highlightOnHover mb={20}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Level</Table.Th>
                        <Table.Th>School</Table.Th>
                        <Table.Th>Casting Time</Table.Th>
                        <Table.Th>Range</Table.Th>
                        <Table.Th>Archetypes</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
            {currentSpell && <SpellModal spell={currentSpell} opened={opened} onClose={closeModal} />}
        </>
    )
}

export default SpellTable