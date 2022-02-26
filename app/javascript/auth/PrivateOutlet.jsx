import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PrivateOutlet = () => {
    const auth = useAuth();
    const location = useLocation();

    return auth.token ? <Outlet /> : <Navigate to="/login" state={{ from: location }}/>;
}

export default PrivateOutlet