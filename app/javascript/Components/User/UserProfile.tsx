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
                <button className="focus:outline-none">
                    <Avatar>
                        <AvatarFallback>{userInitials}</AvatarFallback>
                    </Avatar>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link to='/dashboard'>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to='/spells'>Spells</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to='/items'>Items</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to='/characters'>Characters</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link to='/profile'>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signout}>
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfile