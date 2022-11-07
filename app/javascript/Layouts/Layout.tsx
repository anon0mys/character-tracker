import React from 'react'
import { useAuth, UserProfile } from '../Auth'
import { ErrorBanner } from '../Errors'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const auth = useAuth()

    return (
        <>
            <UserProfile />
            <ErrorBanner />
            {children}
        </>
    )
}

export default Layout