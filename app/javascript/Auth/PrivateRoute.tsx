import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

const PrivateRoute = () => {
    const auth = useAuth()
    let location = useLocation();
    const user = auth.user 

    if (!user || !user.token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default PrivateRoute