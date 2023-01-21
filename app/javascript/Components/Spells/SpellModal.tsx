import React, { useState } from 'react'
import {
    Button, Divider, Modal, ModalBody, ModalCloseButton, ModalContent,
    ModalFooter, ModalHeader, ModalOverlay, Stack, Text, useDisclosure
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { ISpellType } from '../../Api'
import { AddSpellForm } from '../Characters'

interface SpellModalProps {
    spell: ISpellType
    open: boolean
    close: VoidFunction
}

const SpellModal = ({spell, open, close}: SpellModalProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Modal isOpen={open} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{spell.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack mb='10px'>
                        <p>School: {spell.school}</p>
                        <p>Level: {spell.level}</p>
                        <p>Archetypes: {spell.archetypes.join(', ')}</p>
                        <p>Casting Time: {spell.casting_time}</p>
                        <p>Duration: {spell.duration}</p>
                        <p>Components: {spell.components}</p>
                        <p>Range: {spell.range}</p>
                    </Stack>
                    <Divider />
                    <Text mt='10px'>{spell.description}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        leftIcon={<CheckIcon />}
                        colorScheme='teal'
                        variant='solid'
                        onClick={onOpen}
                    >
                        Add to spell list
                    </Button>
                </ModalFooter>
            </ModalContent>
            <AddSpellForm spell={spell} open={isOpen} close={onClose} />
        </Modal>
    )
}

export default SpellModal