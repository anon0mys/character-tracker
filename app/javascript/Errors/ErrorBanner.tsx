import React from "react"
import { useError } from './ErrorProvider'

const ErrorBanner = () => {
    const {message, shouldDisplay} = useError()

    if (shouldDisplay) {
        return (
            <div>
                <h2>{message}</h2>
            </div>
        )
    }
    return <></>
}

export default ErrorBanner