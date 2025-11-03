import React from "react"
import { useFormContext } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui"
import { Input } from "../ui"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui"
import { archetypes } from "../../Api"

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

const CharacterBioForm = () => {
    const form = useFormContext()
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Character Name" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="race"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Race</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Race" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="archetype"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Class</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {archetypes.map(archetype => (
                                    <SelectItem key={archetype} value={archetype}>
                                        {archetype}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="background"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Background</FormLabel>
                        <FormControl>
                            <Input placeholder="Your Background" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="alignment"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Alignment</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Alignment" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {alignmentOptions.map(alignment => (
                                    <SelectItem key={alignment.value} value={alignment.value}>
                                        {alignment.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                    <FormItem className="flex-1 min-w-[150px]">
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                placeholder="20"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default CharacterBioForm