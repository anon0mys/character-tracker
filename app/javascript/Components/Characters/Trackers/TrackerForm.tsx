import React from 'react'
import { ICharacterTrackerType, ResetOn } from '../../../Api'
import { Button, Input, Label } from '../../ui'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../../ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../ui/select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const RESET_OPTIONS: { value: ResetOn; label: string }[] = [
    { value: 'short_rest', label: 'Short Rest' },
    { value: 'long_rest', label: 'Long Rest' },
    { value: 'dawn', label: 'Dawn' },
    { value: 'manual', label: 'Manual' },
    { value: 'never', label: 'Never' },
]

const schema = z.object({
    name: z.string().min(1, 'Name required'),
    max_uses: z.number().int().min(0),
    reset_on: z.enum(['short_rest', 'long_rest', 'dawn', 'manual', 'never']),
    category: z.string().optional(),
    description: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
    open: boolean
    onClose: () => void
    tracker?: ICharacterTrackerType | null
    onSubmit: (values: {
        name: string
        max_uses: number
        reset_on: ResetOn
        category?: string
        description?: string
    }) => void
}

const TrackerForm = ({ open, onClose, tracker, onSubmit }: Props) => {
    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: tracker?.name || '',
            max_uses: tracker?.max_uses ?? 1,
            reset_on: tracker?.reset_on || 'long_rest',
            category: tracker?.category || '',
            description: tracker?.description || '',
        },
    })

    const submit = (values: FormData) => {
        onSubmit(values)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={(o) => { if (!o) { form.reset(); onClose() } }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{tracker ? 'Edit Tracker' : 'Add Tracker'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(submit)} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input {...form.register('name')} placeholder="e.g. Flash of Genius" />
                        {form.formState.errors.name && (
                            <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label>Max Uses</Label>
                            <Input
                                type="number"
                                min={0}
                                {...form.register('max_uses', { valueAsNumber: true })}
                            />
                        </div>
                        <div>
                            <Label>Resets On</Label>
                            <Controller
                                control={form.control}
                                name="reset_on"
                                render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RESET_OPTIONS.map(o => (
                                                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Category</Label>
                        <Input {...form.register('category')} placeholder="e.g. feature, consumable, item charge" />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Input {...form.register('description')} placeholder="Optional notes" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => { form.reset(); onClose() }}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TrackerForm
