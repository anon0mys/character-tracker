import React from 'react'
import { Button } from '../ui'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog'

interface ConfirmModalProps {
    copy: string
    open: boolean
    setOpen: (open: boolean) => void
    onSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void
    children: React.ReactNode
}

const ConfirmModal = ({copy, open, setOpen, onSubmit, children}: ConfirmModalProps) => {
    const submit = (event: React.MouseEvent<HTMLButtonElement>) => {
        onSubmit(event)
        setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{copy}</DialogTitle>
                    <DialogDescription>
                        {children}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={submit}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmModal