import React, { useState } from 'react'
import { ICharacterType } from '../../../Api'
import { Button, Input } from '../../ui'
import Pip from './Pip'

interface Props {
    character: ICharacterType
    patch: (updates: Partial<ICharacterType>, opts?: { debounce?: boolean }) => void
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

const HitPointsTile = ({ character, patch }: Props) => {
    const [delta, setDelta] = useState('')

    const applyDamage = () => {
        const amount = parseInt(delta, 10)
        if (!amount || amount <= 0) return
        let remaining = amount
        let newTemp = character.temp_hitpoints
        if (newTemp > 0) {
            const absorbed = Math.min(newTemp, remaining)
            newTemp -= absorbed
            remaining -= absorbed
        }
        const newCurrent = Math.max(0, character.current_hitpoints - remaining)
        patch({ temp_hitpoints: newTemp, current_hitpoints: newCurrent }, { debounce: false })
        setDelta('')
    }

    const applyHeal = () => {
        const amount = parseInt(delta, 10)
        if (!amount || amount <= 0) return
        const newCurrent = clamp(character.current_hitpoints + amount, 0, character.max_hitpoints)
        patch({ current_hitpoints: newCurrent }, { debounce: false })
        setDelta('')
    }

    const setTempHp = (v: number) => patch({ temp_hitpoints: Math.max(0, v) })
    const setBonus = (v: number) => patch({ max_hitpoints_bonus: Math.max(0, v) })

    const setDeathSave = (kind: 'success' | 'failure', pips: number) => {
        if (kind === 'success') patch({ death_save_successes: pips }, { debounce: false })
        else patch({ death_save_failures: pips }, { debounce: false })
    }

    const isDown = character.current_hitpoints <= 0

    return (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-4 sm:p-5">
            <div className="flex items-baseline justify-between mb-2">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wide">Hit Points</h4>
                {character.max_hitpoints_bonus > 0 && (
                    <span className="text-xs bg-emerald-500/20 text-emerald-600 px-2 py-0.5 rounded">
                        +{character.max_hitpoints_bonus} bonus
                    </span>
                )}
            </div>
            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-4xl font-bold">{character.current_hitpoints}</span>
                <span className="text-lg text-muted-foreground">/ {character.max_hitpoints}</span>
                {character.temp_hitpoints > 0 && (
                    <span className="ml-2 text-sm bg-primary/20 text-primary px-2 py-0.5 rounded">
                        +{character.temp_hitpoints} temp
                    </span>
                )}
            </div>
            <div className="flex gap-2 mb-3">
                <Input
                    inputMode="numeric"
                    value={delta}
                    onChange={(e) => setDelta(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Amount"
                    className="h-9 w-24"
                />
                <Button size="sm" variant="destructive" onClick={applyDamage}>Damage</Button>
                <Button size="sm" onClick={applyHeal} className="bg-emerald-600 hover:bg-emerald-700 text-white">Heal</Button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                <label className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">Temp HP</span>
                    <Input
                        inputMode="numeric"
                        value={character.temp_hitpoints}
                        onChange={(e) => setTempHp(parseInt(e.target.value || '0', 10))}
                        className="h-8"
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs">Max HP Bonus</span>
                    <Input
                        inputMode="numeric"
                        value={character.max_hitpoints_bonus}
                        onChange={(e) => setBonus(parseInt(e.target.value || '0', 10))}
                        className="h-8"
                    />
                </label>
            </div>
            {isDown && (
                <div className="pt-3 border-t border-primary/20 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-emerald-600 uppercase font-semibold">Successes</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map((n) => (
                                <Pip
                                    key={n}
                                    filled={character.death_save_successes >= n}
                                    onClick={() => setDeathSave('success', character.death_save_successes >= n ? n - 1 : n)}
                                    color="success"
                                    size="sm"
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-destructive uppercase font-semibold">Failures</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map((n) => (
                                <Pip
                                    key={n}
                                    filled={character.death_save_failures >= n}
                                    onClick={() => setDeathSave('failure', character.death_save_failures >= n ? n - 1 : n)}
                                    color="destructive"
                                    size="sm"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HitPointsTile
