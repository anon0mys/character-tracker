import React, { useContext } from 'react'
import { useState, createContext } from 'react'
import { AuthStore, UserType} from './AuthStore'
import Client from '../Client'
import { useError } from '../Errors'

interface AuthContextType {
    user: UserType | null;
    signin: (email: string, password: string, callback: VoidFunction) => void;
    signup: (email: string, password: string, passwordConfirmation: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
}

const AuthContext = createContext<AuthContextType>(null!);


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const storage = AuthStore()
    const [user, setUser] = useState(storage.getUser());
    const client = Client()
    const errors = useError()

    const signin = (email: string, password: string, callback: VoidFunction) => {
        let data = {
            user: {
                email: email,
                password: password
            }
        }

        client.post({path: '/users/login', payload: data})
            .then(data => {
                const user = {email: data.user.email, token: data.token}
                storage.saveUser(user)
                setUser(user)
                callback()
            })
            .catch(error => {
                console.log(error)
                errors.setError('Invalid email or password. Please try again!')
            })
    };

    const signup = (email: string, password: string, passwordConfirmation: string, callback: VoidFunction) => {
        let data = {
            user: {
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
            }
        }

        client.post({path: '/users', payload: data})
            .then(data => {
                const user = { email: data.user.email, token: data.token }
                storage.saveUser(user)
                setUser(data.user)
                callback()
            })
            .catch(error => {
                console.log(error)
                errors.setError('Username is taken or passwords dont match. Please try again!')
            })
    };

    const signout = (callback: VoidFunction) => {
        const token = user && user.token
        client.destroy({path: '/users/logout', token: token})
            .then(() => {
                storage.removeUser()
                setUser(null)
                callback()
            })
    };

    const auth = { user, signin, signup, signout }

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

const useAuth = () => {
    return useContext(AuthContext)
}

export { AuthProvider, useAuth }