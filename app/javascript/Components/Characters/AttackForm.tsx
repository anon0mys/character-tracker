import React, { useState } from 'react'
import { Client, IAttackType } from '../../Api'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '../ui/dialog'
import { Input } from '../ui'
import { Label } from '../ui'
import { Button } from '../ui'
import { useAuth } from '../../Auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '../ui'

const attackSchema = z.object({
    name: z.string().min(2, 'Name must have at least 2 letters'),
    bonus: z.string(),
    description: z.string().min(2, 'Description must have at least 2 letters'),
    character_id: z.string(),
})

type AttackFormData = z.infer<typeof attackSchema>

interface AttackFormProps {
    attack?: IAttackType
    opened: boolean
    onClose: (attack: IAttackType | undefined) => void;
}

const AttackForm = ({ attack, opened, onClose }: AttackFormProps) => {
    const auth = useAuth()
    const client = Client()

    const isUpdate = !!attack

    const form = useForm<AttackFormData>({
        resolver: zodResolver(attackSchema),
        defaultValues: {
            name: attack ? attack.name : '',
            bonus: attack ? attack.bonus : '',
            description: attack ? attack.description : '',
            character_id: attack ? attack.character_id : '',
        },
    })

    const handleClose = () => {
        form.reset()
        onClose(attack)
    }

    const handleSubmit = (values: AttackFormData) => {
        let url = `/characters/${attack?.character_id}/attacks`
        if (isUpdate) {
            url += `/${attack?.id}`
        }
        const data = {
            ...values
        }
        const request = { path: url, payload: data, token: auth.getToken() }
        if (isUpdate) {
            client.post(request).then(data => handleClose())
        } else {
            client.patch(request).then(data => handleClose())
        }
    }

    return (
        <Dialog open={opened} onOpenChange={handleClose}>
            <DialogContent className="border-primary/30 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-primary">Attack</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bonus"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bonus</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Bonus" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-2 border-t border-primary/20 pt-4">
                            <Button type="button" variant="outline" onClick={handleClose} className="border-primary/30">Cancel</Button>
                            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 ">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AttackForm
