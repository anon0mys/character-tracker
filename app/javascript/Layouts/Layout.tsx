import React from 'react'
import { UserProfile } from '../Auth'
import { ErrorBanner } from '../Errors'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <UserProfile />
            <ErrorBanner />
            {children}
        </>
    )
}

export default Layout