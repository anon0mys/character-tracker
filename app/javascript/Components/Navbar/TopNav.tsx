import React from "react"
import { UserProfile } from "../User"
import { useAuth } from '../../Auth/AuthProvider'
import VisitorNav from "../User/VisiitorNav"

const TopNav = () => {
    const auth = useAuth();

    return (
        <div className="flex justify-end shrink-0">
            { auth.user ? <UserProfile /> : <VisitorNav /> }
        </div>
    )
}

export default TopNav