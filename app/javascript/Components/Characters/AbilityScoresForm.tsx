import { Flex, NumberInput } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import React from "react"
import { ICharacterType } from "../../Api"

interface AbilityProps {
    form: UseFormReturnType<ICharacterType>,
}

const AbilityScoresForm = ({form}: AbilityProps) => {
    return (
        <Flex>
            <NumberInput
                label="Strength"
                placeholder="10"
                {...form.getInputProps('strength')}
            />
            <NumberInput
                label="Dexterity"
                placeholder="10"
                {...form.getInputProps('dexterity')}
            />
            <NumberInput
                label="Constitution"
                placeholder="10"
                {...form.getInputProps('constitution')}
            />
            <NumberInput
                label="Intelligence"
                placeholder="10"
                {...form.getInputProps('intelligence')}
            />
            <NumberInput
                label="Wisdom"
                placeholder="10"
                {...form.getInputProps('wisdom')}
            />
            <NumberInput
                label="Charisma"
                placeholder="10"
                {...form.getInputProps('charisma')}
            />
        </Flex>
    )
}

export default AbilityScoresForm