import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'

const VisitorNav = () => {
    return (
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link to='/login'>Log In</Link>
            </Button>
            <Button asChild>
                <Link to='/sign-up'>Sign Up</Link>
            </Button>
        </div>
    )
}

export default VisitorNav