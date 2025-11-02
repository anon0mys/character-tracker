import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback } from '../ui'
import { 
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '../ui'
import { useAuth } from '../../Auth/AuthProvider'

const UserProfile = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const signout = (event: React.MouseEvent) => {
        event.preventDefault()
        auth.signout(() => {
            navigate('/');
        });
    };

    const userInitials = auth.user?.email ? auth.user.email.charAt(0).toUpperCase() : 'U'

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-all hover:ring-2 hover:ring-primary/50">
                    <Avatar className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">{userInitials}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm text-muted-foreground border-b mb-1">
                    {auth.user?.email}
                </div>
                <DropdownMenuItem asChild>
                    <Link to='/dashboard' className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to='/spells' className="cursor-pointer">Spells</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to='/items' className="cursor-pointer">Items</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to='/characters' className="cursor-pointer">Characters</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to='/profile' className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signout} className="text-destructive focus:text-destructive cursor-pointer">
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfile