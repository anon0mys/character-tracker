import React from 'react'
import { Client, IAttackType } from '../../Api'
import { Modal, Title, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useAuth } from '../../Auth'
import { useNavigate } from 'react-router-dom'

interface AttackFormProps {
    attack?: IAttackType
    opened: boolean
    onClose: (attack: IAttackType | undefined) => void;
}

const AttackForm = ({ attack, opened, onClose }: AttackFormProps) => {
    const auth = useAuth()
    const client = Client()

    const isUpdate = !!attack

    const form = useForm<IAttackType>({
        validateInputOnBlur: true,
        initialValues: {
            name: attack ? attack.name : '',
            bonus: attack ? attack.bonus : '',
            description: attack ? attack.description : '',
            character_id: attack ? attack.character_id : '',
        },

        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            description: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
        },
    });

    const handleClose = () => {
        onClose(attack)
    }

    const handleSubmit = (values: IAttackType) => {
        let url = `/characters/${attack?.character_id}/attacks`
        if (isUpdate) {
            url += `/${attack?.id}`
        }
        const data = {
            ...values
        }
        const request = { path: url, payload: data, token: auth.getToken() }
        if (isUpdate) {
            client.post(request).then(data => handleClose(data))
        } else {
            client.patch(request).then(data => handleClose(data))
        }
        
    }

    return (
        <Modal opened={opened} onClose={handleClose} title="Attack" centered>
            <Title>Attack</Title>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <TextInput
                    label="Name"
                    placeholder="Name"
                    {...form.getInputProps('name')}
                />
                <TextInput
                    label="Bonus"
                    placeholder="Bonus"
                    {...form.getInputProps('bonus')}
                />
                <TextInput
                    label="Description"
                    placeholder="Description"
                    {...form.getInputProps('description')}
                />
            </form>
        </Modal>
    )
}

export default AttackForm