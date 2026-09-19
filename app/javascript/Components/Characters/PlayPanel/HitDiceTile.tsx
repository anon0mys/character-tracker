import React from 'react'
import { ICharacterType } from '../../../Api'
import { Button } from '../../ui'

interface Props {
    character: ICharacterType
    patch: (updates: Partial<ICharacterType>, opts?: { debounce?: boolean }) => void
}

const HitDiceTile = ({ character, patch }: Props) => {
    const remaining = character.hit_dice_remaining ?? character.level
    const total = character.level

    const set = (n: number) => {
        const clamped = Math.max(0, Math.min(total, n))
        patch({ hit_dice_remaining: clamped }, { debounce: false })
    }

    return (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-4 sm:p-5">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wide mb-3">Hit Dice</h4>
            <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold">{remaining}/{total}</span>
                <span className="text-sm text-muted-foreground">{character.hit_die_type}</span>
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => set(remaining - 1)} disabled={remaining <= 0}>−1</Button>
                <Button size="sm" variant="outline" onClick={() => set(remaining + 1)} disabled={remaining >= total}>+1</Button>
            </div>
        </div>
    )
}

export default HitDiceTile
