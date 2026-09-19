import React from 'react'
import { ICharacterType } from '../../../Api'
import HitPointsTile from './HitPointsTile'
import SpellSlotsGrid from './SpellSlotsGrid'
import HitDiceTile from './HitDiceTile'
import StatusTile from './StatusTile'
import RestButtons from './RestButtons'

interface Props {
    character: ICharacterType
    setCharacter: React.Dispatch<React.SetStateAction<ICharacterType>>
    patch: (updates: Partial<ICharacterType>, opts?: { debounce?: boolean }) => void
}

const PlayPanel = ({ character, setCharacter, patch }: Props) => {
    return (
        <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-primary/40 shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-primary">Play</h3>
                <RestButtons character={character} onRested={setCharacter} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <HitPointsTile character={character} patch={patch} />
                <SpellSlotsGrid character={character} patch={patch} />
                <HitDiceTile character={character} patch={patch} />
                <StatusTile character={character} patch={patch} />
            </div>
        </div>
    )
}

export default PlayPanel
