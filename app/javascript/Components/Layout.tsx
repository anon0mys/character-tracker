import React from 'react'
import { TopNav } from './Navbar'
import { ErrorBanner } from '../Errors'
import { useGame } from '../Contexts'
import { ThemeToggle } from './ui/theme-toggle'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { game } = useGame();

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <div className="container mx-auto px-4">
                    <div className="flex h-14 items-center justify-between gap-4">
                        <h1 className="text-lg font-semibold tracking-tight">
                            {game ? game.name : 'Dungeon Tracker'}
                        </h1>
                        <div className="flex items-center gap-4">
                            <TopNav />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>
            <ErrorBanner />
            <main className="container mx-auto px-4 py-6 max-w-7xl">
                {children}
            </main>
        </>
    )
}

export default Layout