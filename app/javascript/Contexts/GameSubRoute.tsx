import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useGame } from './GameProvider';

const GameSubRoute = () => {
    const {game} = useGame()
    let location = useLocation();

    if (!game) {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return <Outlet />;
}

export default GameSubRoute