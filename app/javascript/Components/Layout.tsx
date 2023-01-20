import React from 'react'
import { Grid, GridItem, Heading } from '@chakra-ui/react'
import { TopNav } from './Navbar'
import { ErrorBanner } from '../Errors'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Grid
                gridTemplateColumns='1fr 4fr 1fr'
                justifyItems='center'
                py='20px'
            >
                <GridItem />
                <Heading>Dungeon Notes</Heading>
                <TopNav />
            </Grid>
            <ErrorBanner />
            <div className='content'>
                {children}
            </div>
        </>
    )
}

export default Layout