import React from 'react'
import AuthService from './AuthService';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
    const auth = AuthService();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider