import React from 'react'
import { ISpellType } from '../../Api'
import { AddSpellForm } from '../Characters'
import { Button, Modal, Group, Text, Title, CheckIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface SpellModalProps {
    spell?: ISpellType
    opened: boolean
    onClose: VoidFunction
}

const SpellModal = ({ spell, opened, onClose }: SpellModalProps) => {
    const [spellListModalOpen, {open, close}] = useDisclosure(false);

    const onSubmit = () => {
        onClose()
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Spell" centered>
            <Title order={2}>{spell.name}</Title>
            <Group mb='10px'>
                <p>School: {spell.school}</p>
                <p>Level: {spell.level}</p>
                <p>Archetypes: {spell.archetypes.join(', ')}</p>
                <p>Casting Time: {spell.casting_time}</p>
                <p>Duration: {spell.duration}</p>
                <p>Components: {spell.components}</p>
                <p>Range: {spell.range}</p>
            </Group>
            <Text>{spell.description}</Text>
            <Button
                leftSection={<CheckIcon />}
                onClick={open}
            >
                Add to spell list
            </Button>
            <AddSpellForm spell={spell} opened={spellListModalOpen} onClose={close} onSubmit={onSubmit} />
        </Modal>
    )
}

export default SpellModal