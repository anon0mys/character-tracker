import React from "react"
import { Flex, NativeSelect, NumberInput, TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { archetypes, ICharacterType } from "../../Api"

interface CharacterBioProps {
    form: UseFormReturnType<ICharacterType>
}

const alignmentOptions = [
    {label: 'Lawful Good', value: 'LG'},
    {label: 'Neutral Good', value: 'NG'},
    {label: 'Chaotic Good', value: 'CG'},
    {label: 'Lawful Neutral', value: 'LN'},
    {label: 'Neutral', value: 'TN'},
    {label: 'Chaotic Neutral', value: 'CN'},
    {label: 'Lawful Evil', value: 'LE'},
    {label: 'Neutral Evil', value: 'NE'},
    {label: 'Chaotic Evil', value: 'CE'},
    {label: 'Unaligned', value: 'UN'},
]

const CharacterBioForm = ({form}: CharacterBioProps) => {
    return (
        <Flex direction="row" gap="md" justify="center">
            <TextInput
                label="Name"
                placeholder="Your Character Name"
                {...form.getInputProps('name')}
            />
            <TextInput
                label="Race"
                placeholder="Your Race"
                {...form.getInputProps('race')}
            />
            <NativeSelect
                label="Class"
                data={['Select Class', ...archetypes]}
                {...form.getInputProps('archetype')}
            />
            <TextInput
                label="Background"
                placeholder="Your Background"
                {...form.getInputProps('background')}
            />
            <NativeSelect
                label="Alignment"
                data={['Select Alignment', ...alignmentOptions]}
                {...form.getInputProps('alignment')}
            />
            <NumberInput
                label="Age"
                placeholder="20"
                {...form.getInputProps('age')}
            />
        </Flex>
    )
}

export default CharacterBioForm