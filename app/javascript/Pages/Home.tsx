import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Components/ui'
import { UserPlus, LogIn } from 'lucide-react'

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold tracking-tight text-neon-cyan">
                    Welcome to Dungeon Tracker
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Manage your D&D campaigns, characters, spells, and items all in one place
                </p>
            </div>
            <div className="flex items-center justify-center gap-12 w-full max-w-2xl">
                <div className="flex flex-col items-center space-y-6 flex-1 p-8 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:neon-glow transition-all duration-300">
                    <div className="p-4 rounded-full bg-primary/20 neon-glow">
                        <UserPlus className="h-12 w-12 text-primary" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold">New to Dungeon Tracker?</h3>
                        <p className="text-sm text-muted-foreground">Create an account to get started</p>
                    </div>
                    <Button asChild size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
                        <Link to='sign-up'>Sign Up</Link>
                    </Button>
                </div>
                <div className="h-32 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
                <div className="flex flex-col items-center space-y-6 flex-1 p-8 rounded-2xl border border-accent/30 bg-card/50 backdrop-blur-sm hover:border-accent/50 hover:neon-glow-purple transition-all duration-300">
                    <div className="p-4 rounded-full bg-accent/20 neon-glow-purple">
                        <LogIn className="h-12 w-12 text-accent" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold">Returning User?</h3>
                        <p className="text-sm text-muted-foreground">Sign in to continue your adventures</p>
                    </div>
                    <Button asChild variant="outline" size="lg" className="w-full border-accent/50 text-accent hover:bg-accent/10 hover:neon-glow-purple">
                        <Link to='login'>Log In</Link>
                    </Button>
                </div>
            </div>
        </div>
    )

}

export default Home