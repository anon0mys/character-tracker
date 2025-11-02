import React from 'react'
import { TopNav } from './Navbar'
import { ErrorBanner } from '../Errors'
import { useGame } from '../Contexts'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { game } = useGame();

    return (
        <>
            <div className="grid grid-cols-[1fr_4fr_1fr] justify-items-center py-5">
                <div />
                <h1 className="text-2xl font-bold">{game ? game.name : 'Dungeon Notes'}</h1>
                <TopNav />
            </div>
            <ErrorBanner />
            <div className='content'>
                {children}
            </div>
        </>
    )
}

export default Layout