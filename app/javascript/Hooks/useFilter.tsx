import React, { useReducer } from 'react';
import { Menu } from '@mantine/core';

const filterReducer = (state, filterItem) => {
    if (state.includes(filterItem)) {
        let tempFilters = [...state]
        let index = tempFilters.indexOf(filterItem)
        tempFilters.splice(index, 1)
        return tempFilters
    } else {
        return [...state, filterItem]
    }
}

const useFilter = (filterLabels) => {
    const [filters, setFilters] = useReducer(filterReducer, [])

    const menuItems = filterLabels.map(label => {
        const isActive = filters.includes(label)

        return (
            <Menu.Item
                key={label}
                bg={isActive ? 'blue' : ''}
                onClick={() => setFilters(label)}
            >
                { label }
            </Menu.Item >
        )
    })

    return [ filters, menuItems ]
}

export default useFilter