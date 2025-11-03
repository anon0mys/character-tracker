import React, { useContext } from 'react'
import { createContext, useState } from 'react'
import { useToast } from '../Components/ui'

interface ErrorContextType {
    message: string;
    shouldDisplay: boolean;
    setError: (error: string | Error | any) => void;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType>(null!)

const ErrorProviderInner = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState('')
    const [displayed, setDisplayed] = useState(false)
    const { toast } = useToast()

    const clearError = () => {
        setMessage('')
        setDisplayed(false)
    }

    const setError = (error: string | Error | any) => {
        let errorMessage = 'An error occurred'
        
        if (typeof error === 'string') {
            errorMessage = error
        } else if (error instanceof Error) {
            errorMessage = error.message
        } else if (error?.message) {
            errorMessage = error.message
        } else if (Array.isArray(error) && error.length > 0) {
            errorMessage = typeof error[0] === 'string' ? error[0] : error[0]?.message || errorMessage
        } else if (typeof error === 'object' && error !== null) {
            // Try to extract error message from common error formats
            errorMessage = error.errors?.[0]?.message || error.error?.message || error.error || errorMessage
        }

        setMessage(errorMessage)
        setDisplayed(true)
        
        // Show toast notification (only if not already shown by API Client)
        // This is useful for non-API errors
        toast({
            variant: "destructive",
            title: "Error",
            description: errorMessage,
        })

        const timer = setTimeout(clearError, 5000);
        return () => clearTimeout(timer);
    }

    const value = {
        message: message,
        shouldDisplay: displayed,
        setError: setError,
        clearError: clearError
    }
    return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
}

const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    return <ErrorProviderInner>{children}</ErrorProviderInner>
}

const useError = () => {
    return useContext(ErrorContext)
}

export { ErrorProvider, useError }
