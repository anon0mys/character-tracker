import React, { useReducer, useEffect, useState } from 'react';
import { DropdownMenuCheckboxItem } from '../Components/ui';

const filterReducer = (state: string[], action: string | '__CLEAR_ALL__'): string[] => {
    if (action === '__CLEAR_ALL__') {
        return []
    }
    if (state.includes(action)) {
        let tempFilters = [...state]
        let index = tempFilters.indexOf(action)
        tempFilters.splice(index, 1)
        return tempFilters
    } else {
        return [...state, action]
    }
}

const useFilter = (filterLabels: string[], storageKey: string) => {
    // Initialize from localStorage
    const getInitialFilters = (): string[] => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem(storageKey)
                if (stored) {
                    const parsed = JSON.parse(stored)
                    // Validate that stored filters are still valid options
                    return Array.isArray(parsed) ? parsed.filter(f => filterLabels.includes(f)) : []
                }
            } catch (e) {
                console.error(`Error loading filters from localStorage for ${storageKey}:`, e)
            }
        }
        return []
    }

    const [filters, setFilters] = useReducer(filterReducer, getInitialFilters())
    const [isInitialized, setIsInitialized] = useState(false)

    // Save to localStorage whenever filters change (after initial load)
    useEffect(() => {
        if (isInitialized && typeof window !== 'undefined') {
            try {
                localStorage.setItem(storageKey, JSON.stringify(filters))
            } catch (e) {
                console.error(`Error saving filters to localStorage for ${storageKey}:`, e)
            }
        } else {
            setIsInitialized(true)
        }
    }, [filters, storageKey, isInitialized])

    const clearFilters = () => {
        setFilters('__CLEAR_ALL__')
    }

    const removeFilter = (filterToRemove: string) => {
        if (filters.includes(filterToRemove)) {
            // Toggle it off by calling setFilters with the filter to remove
            setFilters(filterToRemove)
        }
    }

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

    return [ filters, menuItems, clearFilters, removeFilter ] as [string[], React.ReactNode[], () => void, (filter: string) => void]
}

export default useFilter