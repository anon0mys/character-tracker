import React from "react"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui"
import { Input } from "../ui"

const AbilityScoresForm = () => {
    const form = useFormContext()
    const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

    return (
        <div className="flex flex-wrap gap-4">
            {abilities.map((ability) => (
                <FormField
                    key={ability}
                    control={form.control}
                    name={ability as any}
                    render={({ field }) => (
                        <FormItem className="flex-1 min-w-[150px]">
                            <FormLabel>{ability.charAt(0).toUpperCase() + ability.slice(1)}</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="10"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
        </div>
    )
}

export default AbilityScoresForm