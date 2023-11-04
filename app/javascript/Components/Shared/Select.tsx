import React from 'react'
import { NativeSelect } from "@mantine/core"


const Select = ({data, ...props}) => {
    const optionsWithDefault = [
        {label: '----', value: ''},
        ...data
    ]

    return (
        <NativeSelect
            data={optionsWithDefault}
            {...props}
        />
    )
}

export default Select