import React, { useState } from 'react'
// import { Card } from 'semantic-ui-react'
import {
    Card, CardHeader, CardBody, CardFooter,
    Divider, Heading, Stack, Text, useDisclosure
} from '@chakra-ui/react'
import { ISpellType } from '../../Api'
import SpellModal from './SpellModal'

interface SpellCardProps {
    spell: ISpellType
}

const SpellCard = ({ spell }: SpellCardProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <Card key={spell.id} variant='elevated' onClick={onOpen}>
            <CardHeader>
                <Heading>{spell.name}</Heading>
            </CardHeader>
            <CardBody>
                <Stack>
                    <Text as='i'>Level {spell.level}</Text>
                    <Text as='i'>{spell.school}</Text>
                </Stack>
            </CardBody>
            <Divider />
            <CardFooter>
                <Text as='i'>{spell.archetypes.join(', ')}</Text>
            </CardFooter>
            <SpellModal spell={spell} open={isOpen} close={onClose} />
        </Card>
    )
}

export default SpellCard