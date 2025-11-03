import React from "react"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui"
import { Input, Checkbox } from "../ui"
import { abilities } from "../../Api"

const CharacterStatsForm = () => {
    const form = useFormContext()

    return (
        <div className="flex flex-wrap gap-4 items-end">
            <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Level</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="1"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="speed"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Speed</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="30"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="initiativeBonus"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Initiative Bonus</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="acBonus"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>AC Bonus</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="proficiencies"
                render={() => (
                    <FormItem className="flex-1 min-w-[200px]">
                        <FormLabel>Proficiencies</FormLabel>
                        <div className="flex flex-wrap gap-4">
                            {abilities.map((ability) => (
                                <FormField
                                    key={ability}
                                    control={form.control}
                                    name="proficiencies"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={ability}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(ability)}
                                                        onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, ability])
                                                                : field.onChange(
                                                                      field.value?.filter(
                                                                          (value: string) => value !== ability
                                                                      )
                                                                  )
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {ability}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default CharacterStatsForm