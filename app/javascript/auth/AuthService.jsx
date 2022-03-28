import { useState } from 'react'
import useClient from '../Client'

const AuthService = () => {
    const client = useClient()
    const [token, setToken] = useState(JSON.parse(localStorage.getItem('token')));

    const signin = (email, password, callback) => {
        let data = {
            user: {
                email: email,
                password: password
            }
        }

        client.Post('/users/login', {payload: data})
            .then(data => {
                localStorage.setItem('token', JSON.stringify(data.token))
                setToken(data.token)
                callback()
            })
    };

    const signout = callback => {
        return client.Delete('/users/logout', {token: token})
            .then(() => {
                localStorage.setItem('token', null)
                setToken(null)
                callback()
            })
    };

    return {
        token,
        signin,
        signout
    };
}

export default AuthService