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
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/30 shadow-lg neon-glow p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-neon-cyan">Create an account</h2>
                        <p className="text-muted-foreground">Get started with Dungeon Tracker</p>
                    </div>
                    <form onSubmit={signup} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type='password'
                                placeholder='Create a password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                            <Input
                                id="passwordConfirmation"
                                type='password'
                                placeholder='Confirm your password'
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-4">
                            <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 neon-glow" size="lg">Sign Up</Button>
                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Already have an account? </span>
                                <Link to='/login' className="text-primary hover:text-primary/80 hover:underline font-medium">Log In</Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUp