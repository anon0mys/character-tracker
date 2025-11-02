import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Components/ui'
import { UserPlus, LogIn } from 'lucide-react'

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
            <h1 className="text-4xl font-bold">Welcome to Dungeon Tracker</h1>
            <div className="flex items-center justify-center gap-8 w-full max-w-2xl">
                <div className="flex flex-col items-center space-y-4 flex-1">
                    <UserPlus className="h-12 w-12 text-muted-foreground" />
                    <Button asChild>
                        <Link to='sign-up'>Sign Up</Link>
                    </Button>
                </div>
                <div className="h-16 w-px bg-border" />
                <div className="flex flex-col items-center space-y-4 flex-1">
                    <LogIn className="h-12 w-12 text-muted-foreground" />
                    <Button asChild variant="outline">
                        <Link to='login'>Log In</Link>
                    </Button>
                </div>
            </div>
        </div>
    )

}

export default Home