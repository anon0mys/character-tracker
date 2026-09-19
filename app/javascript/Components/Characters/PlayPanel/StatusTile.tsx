import React from 'react'
import { ICharacterType } from '../../../Api'
import { Input, Button } from '../../ui'
import Pip from './Pip'

interface Props {
    character: ICharacterType
    patch: (updates: Partial<ICharacterType>, opts?: { debounce?: boolean }) => void
}

const StatusTile = ({ character, patch }: Props) => {
    const setExhaustion = (n: number) => {
        const clamped = Math.max(0, Math.min(6, n))
        patch({ exhaustion: clamped }, { debounce: false })
    }
    const toggleInspiration = () => patch({ inspiration: character.inspiration > 0 ? 0 : 1 }, { debounce: false })

    return (
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-4 sm:p-5 space-y-4">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wide">Status</h4>

            <div className="flex items-center justify-between">
                <span className="text-sm">Inspiration</span>
                <Button
                    type="button"
                    size="sm"
                    variant={character.inspiration > 0 ? 'default' : 'outline'}
                    onClick={toggleInspiration}
                    className={character.inspiration > 0 ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}
                >
                    {character.inspiration > 0 ? 'Yes' : 'No'}
                </Button>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Exhaustion</span>
                    <span className="text-xs text-muted-foreground">{character.exhaustion}/6</span>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <Pip
                            key={n}
                            filled={character.exhaustion >= n}
                            color="destructive"
                            size="sm"
                            onClick={() => setExhaustion(character.exhaustion >= n ? n - 1 : n)}
                        />
                    ))}
                </div>
            </div>

            <label className="flex flex-col gap-1">
                <span className="text-sm">Concentrating on</span>
                <Input
                    value={character.concentration_spell || ''}
                    onChange={(e) => patch({ concentration_spell: e.target.value || null })}
                    placeholder="—"
                    className="h-8"
                />
            </label>
        </div>
    )
}

export default StatusTile
