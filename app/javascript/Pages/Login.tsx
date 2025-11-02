import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Auth'
import { Button, Input, Label } from '../Components/ui'

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { from } = location.state || { from: { pathname: "/dashboard" } };
    const login = (event: React.FormEvent) => {
        event.preventDefault()
        auth.signin(email, password, () => {
            navigate(from);
        });
    };

    return (
        <div className="container mx-auto max-w-md mt-8">
            <h2 className="text-xl font-semibold mb-4">Log In</h2>
            <form onSubmit={login} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type='email'
                        placeholder='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type='password'
                        placeholder='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="text-center space-x-4">
                    <Button type="submit">Log in</Button>
                    <Link to='/sign-up' className="text-primary hover:underline">Sign Up</Link>
                </div>      
            </form>
        </div>
    )
}

export default Login