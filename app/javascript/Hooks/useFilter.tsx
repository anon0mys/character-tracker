import React, { useReducer } from 'react';
import { DropdownMenuCheckboxItem } from '../Components/ui';

const filterReducer = (state: string[], filterItem: string): string[] => {
    if (state.includes(filterItem)) {
        let tempFilters = [...state]
        let index = tempFilters.indexOf(filterItem)
        tempFilters.splice(index, 1)
        return tempFilters
    } else {
        return [...state, filterItem]
    }
}

const useFilter = (filterLabels: string[]) => {
    const [filters, setFilters] = useReducer(filterReducer, [])

    const menuItems = filterLabels.map(label => {
        const isActive = filters.includes(label)

        return (
            <DropdownMenuCheckboxItem
                key={label}
                checked={isActive}
                onCheckedChange={() => setFilters(label)}
                className={isActive ? 'bg-accent' : ''}
            >
                { label }
            </DropdownMenuCheckboxItem >
        )
    })

    return [ filters, menuItems ] as [string[], React.ReactNode[]]
}

export default useFilter