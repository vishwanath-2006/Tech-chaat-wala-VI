import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, UserPlus, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const data = await signup(email, password, name);

            console.log("Signup success:", data);
            
            // If session is present immediately, navigate
            if (data.session) {
                navigate('/menu');
            } else {
                // Otherwise user probably needs to confirm email
                setIsSignedUp(true);
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSignedUp) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-md w-full surface-card p-10 rounded-[40px] bg-white border border-slate-100 shadow-2xl text-center space-y-6">
                    <div className="w-20 h-20 bg-green-50 rounded-3xl mx-auto flex items-center justify-center border border-green-100">
                        <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-secondary mb-2">Check Email</h1>
                        <p className="text-slate-500 font-medium">We've sent a verification link to <span className="text-secondary font-bold">{email}</span>. Please authorize your entity.</p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-secondary text-white font-black py-4 rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/30 active:scale-[0.98] transition-all"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-row-reverse">
            {/* Right Box - Graphic Area */}
            <div className="hidden lg:flex w-1/2 bg-surface flex-col justify-center items-center p-12 relative overflow-hidden shrink-0 border-l border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-transparent z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(200,200,200,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(200,200,200,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                <div className="z-10 text-center max-w-sm">
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center mb-8 border border-primary/20">
                        <span className="text-4xl">🚀</span>
                    </div>
                    <h2 className="text-4xl font-black text-secondary leading-tight mb-4">
                        Join the Network
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Create an account to save your favorite builds, track process history, and bypass guest mode limits.
                    </p>
                </div>
            </div>

            {/* Left Box - Form Area */}
            <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative bg-background">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm hover:shadow-md transition-all border border-slate-200"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="w-full max-w-md mx-auto">
                    <div className="mb-8 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-secondary mb-3 tracking-tight">Sign Up</h1>
                        <p className="text-slate-500 font-medium">Initialize new user object</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <span className="pt-0.5 mt-0">⚠️</span> {error}
                            </div>
                        )}
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary ml-1 block">Full Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Steve Jobs"
                                className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 px-5 text-secondary font-medium tracking-wide placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-sm"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary ml-1 block">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="steve@apple.com"
                                className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 px-5 text-secondary font-medium tracking-wide placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-sm"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary ml-1 block">Password AuthKey</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 px-5 text-secondary font-medium tracking-wide placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-sm pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary ml-1 block">Confirm AuthKey</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 px-5 text-secondary font-medium tracking-wide placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? 'Compiling...' : 'Create Account'}
                            {!isLoading && <UserPlus size={20} />}
                        </button>
                    </form>

                    <p className="mt-8 text-center font-medium text-slate-500">
                        Existing entity?{' '}
                        <button onClick={() => navigate('/login')} className="font-bold text-secondary hover:underline">
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
