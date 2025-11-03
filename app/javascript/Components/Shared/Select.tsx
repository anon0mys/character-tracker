import React from 'react'
import {
    Select as SelectPrimitive,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui'

interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive> {
    data: Array<{label: string, value: string}>
    placeholder?: string
}

const Select = ({data, placeholder = '----', ...props}: SelectProps) => {
    const optionsWithDefault = [
        {label: placeholder, value: ''},
        ...data
    ]

    return (
        <SelectPrimitive {...props}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {optionsWithDefault.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </SelectPrimitive>
    )
}

export default Select