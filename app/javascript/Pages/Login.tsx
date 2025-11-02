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
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md">
                <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-primary/30 shadow-lg neon-glow p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-neon-cyan">Welcome back</h2>
                        <p className="text-muted-foreground">Sign in to your account to continue</p>
                    </div>
                    <form onSubmit={login} className="space-y-5">
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
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-4">
                            <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 neon-glow" size="lg">Log in</Button>
                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Don't have an account? </span>
                                <Link to='/sign-up' className="text-primary hover:text-primary/80 hover:underline font-medium">Sign Up</Link>
                            </div>
                        </div>      
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login