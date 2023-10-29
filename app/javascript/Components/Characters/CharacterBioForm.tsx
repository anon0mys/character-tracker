import React from "react"
import { Flex, NativeSelect, NumberInput, TextInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { archetypes, ICharacterType } from "../../Api"
import { AlignmentTypes } from "./types"

interface CharacterBioProps {
    form: UseFormReturnType<ICharacterType>
}

const alignmentTypes: AlignmentTypes[] = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil']

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
                data={archetypes}
                {...form.getInputProps('archetype')}
            />
            <TextInput
                label="Background"
                placeholder="Your Background"
                {...form.getInputProps('background')}
            />
            <NativeSelect
                label="Alignment"
                data={alignmentTypes}
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