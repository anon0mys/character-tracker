import React from "react"
import { UseFormReturnType } from "@mantine/form"
import { abilities, ICharacterType } from "../../Api"
import { Checkbox, Flex, NumberInput } from "@mantine/core"

interface CharacterStatsProps {
    form: UseFormReturnType<ICharacterType>
}

const CharacterStatsForm = ({form}: CharacterStatsProps) => {
    const abilityCheckboxes = abilities.map(ability => {
        return <Checkbox key={ability} value={ability} label={ability} />
    })

    return (
        <Flex direction="row" gap="md" justify="center">
            <NumberInput
                label="Level"
                placeholder="1"
                {...form.getInputProps('level')}
            />
            <NumberInput
                label="Speed"
                placeholder="30"
                {...form.getInputProps('speed')}
            />
            <NumberInput
                label="Initiative Bonus"
                placeholder="0"
                {...form.getInputProps('initiativeBonus')}
            />
            <NumberInput
                label="AC Bonus"
                placeholder="0"
                {...form.getInputProps('acBonus')}
            />
            <Checkbox.Group {...form.getInputProps('proficiencies')}>
                {abilityCheckboxes}
            </Checkbox.Group>
        </Flex>
    )
}

export default CharacterStatsForm