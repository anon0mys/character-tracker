import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

const ConfirmModal = ({copy, open, setOpen, onSubmit, children}) => {
    const submit = (event) => {
        onSubmit(event)
        setOpen(false)
    }
    return (
        <Modal
            closeIcon
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
        >
            <Modal.Header>{copy}</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    {children}
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    content='Cancel'
                    color='grey'
                    onClick={() => setOpen(false)}
                />
                <Button
                    content='Confirm'
                    color='red'
                    labelPosition='right'
                    icon='checkmark'
                    onClick={submit}
                />
            </Modal.Actions>
        </Modal>
    )
}

export default ConfirmModal