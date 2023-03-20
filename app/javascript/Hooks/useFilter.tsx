import React, { useReducer } from 'react';
import { MenuItem } from '@chakra-ui/react';
import { ButtonToggle } from '../Components/Shared';

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
        console.log(label, isActive)
        return (
            <MenuItem
                as={ButtonToggle}
                key={label}
                isActive={isActive}
                onClick={() => setFilters(label)}
            >
                { label }
            </MenuItem >
        )
    })

    return [ filters, menuItems ]
}

export default useFilter