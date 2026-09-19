import React from 'react'
import { ICharacterTrackerType } from '../../../Api'
import Pip from '../PlayPanel/Pip'
import { Button } from '../../ui'
import { Pencil, Trash2 } from 'lucide-react'

interface Props {
    tracker: ICharacterTrackerType
    onUpdate: (updates: Partial<ICharacterTrackerType>) => void
    onEdit: () => void
    onDelete: () => void
}

const RESET_LABEL: Record<string, string> = {
    short_rest: 'Short',
    long_rest: 'Long',
    dawn: 'Dawn',
    manual: 'Manual',
    never: 'Never',
}

const TrackerRow = ({ tracker, onUpdate, onEdit, onDelete }: Props) => {
    const clickPip = (n: number) => {
        // if this pip is currently "available" (index < remaining), clicking uses it up
        // remaining = max - current_uses; pip index i is available if i < remaining
        const remaining = tracker.max_uses - tracker.current_uses
        const newUsed = n < remaining ? tracker.current_uses + 1 : tracker.current_uses - 1
        onUpdate({ current_uses: Math.max(0, Math.min(tracker.max_uses, newUsed)) })
    }

    return (
        <div className="flex items-center justify-between gap-3 py-2 px-2 rounded hover:bg-accent/40">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{tracker.name}</span>
                    <span className="text-[10px] uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {RESET_LABEL[tracker.reset_on]}
                    </span>
                </div>
                {tracker.description && (
                    <p className="text-xs text-muted-foreground truncate">{tracker.description}</p>
                )}
            </div>
            <div className="flex gap-1 flex-wrap justify-end max-w-[240px]">
                {Array.from({ length: tracker.max_uses }).map((_, i) => (
                    <Pip
                        key={i}
                        filled={i < (tracker.max_uses - tracker.current_uses)}
                        onClick={() => clickPip(i)}
                        size="sm"
                    />
                ))}
            </div>
            <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={onEdit} aria-label="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" onClick={onDelete} aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    )
}

export default TrackerRow
