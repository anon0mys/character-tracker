import React, { useContext } from 'react'
import { createContext, useState } from 'react'

interface ErrorContextType {
    message: string;
    shouldDisplay: boolean;
    setError: (message: string) => void;
    clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType>(null!)

const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState('')
    const [displayed, setDisplayed] = useState(false)

    const clearError = () => {
        setMessage('')
        setDisplayed(false)
    }

    const setError = (error: string) => {
        setMessage(error)
        setDisplayed(true)
        const timer = setTimeout(clearError, 3000);
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

const useError = () => {
    return useContext(ErrorContext)
}

export { ErrorProvider, useError }
