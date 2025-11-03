import React from 'react'
import { TopNav } from './Navbar'
import { ErrorBanner } from '../Errors'
import { useGame } from '../Contexts'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { game } = useGame();

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60">
                <div className="container mx-auto px-3 sm:px-4">
                    <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-neon-cyan tracking-tight truncate">
                            {game ? game.name : 'Dungeon Tracker'}
                        </h1>
                        <TopNav />
                    </div>
                </div>
            </header>
            <ErrorBanner />
            <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-7xl">
                {children}
            </main>
        </>
    )
}

export default Layout