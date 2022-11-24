import React from 'react'
import { Container, Header } from 'semantic-ui-react'
import { TopNav } from './Navbar'
import { ErrorBanner } from '../Errors'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header textAlign='center' size='huge'>
                <Header.Content>Dungeon Notes</Header.Content>
            </Header>
            <TopNav />
            <ErrorBanner />
            <div className='content'>
                {children}
            </div>
        </>
    )
}

export default Layout