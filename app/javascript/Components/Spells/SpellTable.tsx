import React, { useState } from 'react'
import { Table, TableHeader, TableBody, TableHead, TableRow } from '../ui'
import { ISpellType } from '../../Api';
import SpellRow from './SpellRow';
import SpellModal from './SpellModal';

interface SpellTableProps {
    spells: ISpellType[]
}

const SpellTable = ({spells}: SpellTableProps) => {
    const [currentSpell, setCurrentSpell] = useState<ISpellType | undefined>()
    const [opened, setOpened] = useState(false)
    
    const openModal = (spell: ISpellType) => {
        setCurrentSpell(spell)
        setOpened(true)
    }

    const closeModal = () => {
        setCurrentSpell(undefined)
        setOpened(false)
    }

    const rows = spells.map((spell: ISpellType) => <SpellRow key={spell.id} spell={spell} openModal={openModal} />);

    return (
        <>
            <div className="bg-card/80 backdrop-blur-sm rounded-lg border border-primary/30 shadow-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>School</TableHead>
                            <TableHead>Casting Time</TableHead>
                            <TableHead>Range</TableHead>
                            <TableHead>Archetypes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>{rows}</TableBody>
                </Table>
            </div>
            {currentSpell && <SpellModal spell={currentSpell} opened={opened} onClose={closeModal} />}
        </>
    )
}

export default SpellTable