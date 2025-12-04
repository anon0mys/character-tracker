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
            <DialogContent className="border-primary/30 bg-card/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-primary">{copy}</DialogTitle>
                    <DialogDescription>
                        {children}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 border-t border-primary/20 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="border-primary/30"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={submit}
                        className="-purple"
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmModal