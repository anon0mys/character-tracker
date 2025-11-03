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
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                    <div className="min-w-[600px] sm:min-w-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-xs sm:text-sm">Name</TableHead>
                                    <TableHead className="text-xs sm:text-sm">Level</TableHead>
                                    <TableHead className="text-xs sm:text-sm hidden sm:table-cell">School</TableHead>
                                    <TableHead className="text-xs sm:text-sm hidden md:table-cell">Casting Time</TableHead>
                                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Range</TableHead>
                                    <TableHead className="text-xs sm:text-sm hidden lg:table-cell">Archetypes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>{rows}</TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            {currentSpell && <SpellModal spell={currentSpell} opened={opened} onClose={closeModal} />}
        </>
    )
}

export default SpellTable