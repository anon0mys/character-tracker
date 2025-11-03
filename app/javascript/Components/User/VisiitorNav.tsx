import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'

const VisitorNav = () => {
    return (
        <div className="flex gap-1.5 sm:gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px]">
                <Link to='/login'>Log In</Link>
            </Button>
            <Button asChild size="sm" className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px]">
                <Link to='/sign-up'>Sign Up</Link>
            </Button>
        </div>
    )
}

export default VisitorNav