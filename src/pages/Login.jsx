import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            const data = await login(email, password);
            console.log("Login success:", data);

            const userRole = data.user.user_metadata?.role;
            
            if (userRole === 'staff') {
                navigate('/admin');
            } else {
                navigate('/menu');
            }
        } catch (err) {
            setError(err.message || "Authentication failed. Check your credentials.");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Box - Graphic Area (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 bg-surface flex-col justify-center items-center p-12 relative overflow-hidden shrink-0 border-r border-slate-100">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent z-0" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(200,200,200,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(200,200,200,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                <div className="z-10 text-center max-w-sm">
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center mb-8 border border-primary/20">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-4xl font-black text-secondary leading-tight mb-4">
                        Re-establish Connection
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed">
                        Access your saved configurations, view processing logs, and optimize your ordering timeline.
                    </p>
                </div>
            </div>

            {/* Right Box - Form Area */}
            <div className="flex-1 flex flex-col justify-center p-6 md:p-12 lg:p-24 relative bg-background">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 md:top-10 md:left-10 w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm hover:shadow-md transition-all border border-slate-200"
                >
                    <ArrowLeft size={20} />
                </button>

                <div className="w-full max-w-md mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-secondary mb-3 tracking-tight">Login Portal</h1>
                        <p className="text-slate-500 font-medium">Verify credentials to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                <span className="pt-0.5 mt-0">⚠️</span> {error}
                            </div>
                        )}
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary ml-1 block">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@techchaatwala.com"
                                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-5 text-secondary font-medium tracking-wide placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-sm"
                                />
                            </div>
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
                                    className="w-full bg-white border-2 border-slate-200 rounded-2xl py-4 px-5 text-secondary font-medium tracking-wide placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-primary/5 transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary p-1"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button type="button" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                                Forgot AuthKey?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-secondary text-white font-black py-4 rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-8 relative overflow-hidden"
                        >
                            <span className="relative z-10">{isLoading ? 'Authenticating...' : 'Establish Session'}</span>
                            {!isLoading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />}

                            {/* Button highlight effect */}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-0" />
                        </button>
                    </form>

                    <p className="mt-10 text-center font-medium text-slate-500">
                        New entity?{' '}
                        <button onClick={() => navigate('/signup')} className="font-bold text-primary hover:underline">
                            Initialize account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
