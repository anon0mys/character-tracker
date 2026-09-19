import React from 'react'
import { ICharacterType } from '../../../Api'
import Pip from './Pip'

interface Props {
    character: ICharacterType
    patch: (updates: Partial<ICharacterType>, opts?: { debounce?: boolean }) => void
}

const SpellSlotsGrid = ({ character, patch }: Props) => {
    const hasFullSlots = character.spell_slots_max.length > 0
    const isWarlock = character.pact_slot_level !== null && character.pact_slot_level !== undefined

    if (!hasFullSlots && !isWarlock) return null

    const setUsed = (key: string, newUsed: number) => {
        const next = { ...character.spell_slots_used, [key]: newUsed }
        patch({ spell_slots_used: next }, { debounce: false })
    }

    const rows: { key: string; label: string; max: number }[] = []
    if (isWarlock) {
        const max = character.spell_slots_max[0] || 0
        rows.push({ key: 'pact', label: `Pact (Lv ${character.pact_slot_level})`, max })
    } else {
        character.spell_slots_max.forEach((max, i) => {
            if (max > 0) rows.push({ key: String(i + 1), label: `Level ${i + 1}`, max })
        })
    }

    return (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-4 sm:p-5">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-3">Spell Slots</h4>
            <div className="space-y-2">
                {rows.map((row) => {
                    const used = character.spell_slots_used[row.key] || 0
                    const remaining = row.max - used
                    return (
                        <div key={row.key} className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium min-w-[70px]">{row.label}</span>
                            <div className="flex gap-1 flex-wrap justify-end">
                                {Array.from({ length: row.max }).map((_, i) => {
                                    const isUsed = i < used
                                    return (
                                        <Pip
                                            key={i}
                                            filled={!isUsed}
                                            onClick={() => setUsed(row.key, isUsed ? used - 1 : used + 1)}
                                            size="sm"
                                            label={`${row.label} slot ${i + 1}`}
                                        />
                                    )
                                })}
                            </div>
                            <span className="text-xs text-muted-foreground min-w-[30px] text-right">{remaining}/{row.max}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SpellSlotsGrid
