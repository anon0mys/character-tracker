import React from "react"
import { Link } from "react-router-dom"
import { UserProfile } from "../User"
import { useAuth } from '../../Auth/AuthProvider'
import VisitorNav from "../User/VisiitorNav"
import { Star } from "lucide-react"

const TopNav = () => {
    const auth = useAuth();
    const current = auth.currentCharacter

    return (
        <div className="flex justify-end items-center gap-3 shrink-0">
            {auth.user && current && (
                <Link
                    to={`/characters/${current.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 transition-colors text-sm font-medium"
                    title={`Go to current character: ${current.name}`}
                >
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="truncate max-w-[140px]">{current.name}</span>
                </Link>
            )}
            { auth.user ? <UserProfile /> : <VisitorNav /> }
        </div>
    )
}

export default TopNav