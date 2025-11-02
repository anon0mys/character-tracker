import React from "react"
import { UserProfile } from "../User"
import { useAuth } from '../../Auth/AuthProvider'
import VisitorNav from "../User/VisiitorNav"

const TopNav = () => {
    const auth = useAuth();

    return (
        <div className="flex justify-end mr-2.5">
            { auth.user ? <UserProfile /> : <VisitorNav /> }
        </div>
    )
}

export default TopNav