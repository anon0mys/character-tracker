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
        <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl p-6 sm:p-8 space-y-5 sm:space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary">Create an account</h2>
                        <p className="text-sm sm:text-base text-muted-foreground">Get started with Dungeon Tracker</p>
                    </div>
                    <form onSubmit={signup} className="space-y-4 sm:space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                            <Input
                                id="email"
                                type='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 sm:h-11 min-h-[44px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm sm:text-base">Pa word</Label>
                            <Input
                                id="password"
                                type='password'
                                placeholder='Create a password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-10 sm:h-11 min-h-[44px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="passwordConfirmation" className="text-sm sm:text-base">Confirm Pa word</Label>
                            <Input
                                id="passwordConfirmation"
                                type='password'
                                placeholder='Confirm your password'
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="h-10 sm:h-11 min-h-[44px]"
                            />
                        </div>
                        <div className="space-y-4">
                            <Button type="submit" className="w-full h-11 sm:h-12 bg-primary text-primary-foreground hover:bg-primary/90  min-h-[44px]" size="lg">Sign Up</Button>
                            <div className="text-center text-xs sm:text-sm">
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