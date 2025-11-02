import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Auth'
import { Button, Input, Label } from '../Components/ui'

const SignUp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const { from } = location.state || { from: { pathname: "/dashboard" } };
    const signup = (event: React.FormEvent) => {
        event.preventDefault()
        auth.signup(email, password, passwordConfirmation, () => {
            navigate(from);
        });
    };

    return (
        <div className="container mx-auto max-w-md mt-8">
            <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
            <form onSubmit={signup} className="space-y-4">
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
                <div className="space-y-2">
                    <Label htmlFor="passwordConfirmation">Password Confirmation</Label>
                    <Input
                        id="passwordConfirmation"
                        type='password'
                        placeholder='password confirmation'
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                    />
                </div>
                <div className="text-center space-x-4">
                    <Button type="submit">Sign Up</Button>
                    <Link to='/login' className="text-primary hover:underline">Log In</Link>
                </div>
            </form>
        </div>
    )
}

export default SignUp