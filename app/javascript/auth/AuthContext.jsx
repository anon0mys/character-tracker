import { useContext, createContext } from 'react'

const AuthContext = createContext();

const useAuth = () => {
    return useContext(AuthContext)
}

export {AuthContext, useAuth}