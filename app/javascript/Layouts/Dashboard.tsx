import React from 'react'
import { Link } from 'react-router-dom'


const Dashboard = () => {
    return (
        <>
            <h1>Dashboard</h1>
            <Link to='/characters'>My Characters</Link>
        </>
    )
}

export default Dashboard