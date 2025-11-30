import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Components/ui'
import { UserPlus, LogIn } from 'lucide-react'

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 sm:space-y-12 px-4">
            <div className="text-center space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
                    Welcome to Dungeon Tracker
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                    Manage your D&D campaigns, characters, spells, and items all in one place
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-6 sm:gap-8 lg:gap-12 w-full max-w-2xl">
                <div className="flex flex-col items-center space-y-4 sm:space-y-6 flex-1 p-6 sm:p-8 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                    <div className="p-3 sm:p-4 rounded-full bg-primary/10">
                        <UserPlus className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-base sm:text-lg font-semibold">New to Dungeon Tracker?</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Create an account to get started</p>
                    </div>
                    <Button asChild size="lg" className="w-full min-h-[44px]">
                        <Link to='sign-up'>Sign Up</Link>
                    </Button>
                </div>
                <div className="hidden sm:block h-32 w-px bg-border" />
                <div className="flex flex-col items-center space-y-4 sm:space-y-6 flex-1 p-6 sm:p-8 rounded-xl border bg-card hover:border-accent/50 transition-colors">
                    <div className="p-3 sm:p-4 rounded-full bg-accent/10">
                        <LogIn className="h-8 w-8 sm:h-12 sm:w-12 text-accent" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-base sm:text-lg font-semibold">Returning User?</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">Sign in to continue your adventures</p>
                    </div>
                    <Button asChild variant="outline" size="lg" className="w-full min-h-[44px]">
                        <Link to='login'>Log In</Link>
                    </Button>
                </div>
            </div>
        </div>
    )

}

export default Home