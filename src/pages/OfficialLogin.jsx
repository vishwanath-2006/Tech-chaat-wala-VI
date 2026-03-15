import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, ArrowLeft, UserPlus, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react';

const OfficialLogin = () => {
    // Steps: 0: Selection, 1: Login, 2: Admin Verify, 3: Signup, 4: Success
    const [step, setStep] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Existing Staff Login State
    const [loginCreds, setLoginCreds] = useState({ id: '', password: '' });

    // Admin Verification State
    const [adminCreds, setAdminCreds] = useState({ name: '', password: '' });

    // New Staff Signup State
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirm: '' });

    const { login, logout, signup } = useAuth();
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await login(loginCreds.id, loginCreds.password);
            const role = data.user.user_metadata?.role;
            if (role !== 'staff') {
                await logout();
                throw new Error("Unauthorized: Access restricted to staff members.");
            }
            navigate('/admin');
        } catch (err) {
            setError(err.message || 'Invalid Official ID or Password.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAdminVerify = (e) => {
        e.preventDefault();
        setError('');
        if (adminCreds.name === 'Vishwanath H R' && adminCreds.password === 'Vishwa@12$2006') {
            setStep(3);
        } else {
            setError('Invalid Official Admin Credentials.');
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (signupData.password !== signupData.confirm) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const data = await signup(signupData.email, signupData.password, signupData.name, 'staff');
            if (data.session) {
                navigate('/admin');
            } else {
                setStep(4);
            }
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const resetFlow = () => {
        setStep(0);
        setError('');
        setLoginCreds({ id: '', password: '' });
        setAdminCreds({ name: '', password: '' });
        setSignupData({ name: '', email: '', password: '', confirm: '' });
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Left Graphic Side - Consistent across steps */}
            <div className="hidden md:flex flex-1 bg-secondary text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />
                <button
                    onClick={() => step === 0 ? navigate('/') : setStep(0)}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit font-bold z-10"
                >
                    <ArrowLeft size={20} /> {step === 0 ? 'Terminate Request' : 'Back to Selection'}
                </button>
                <div className="z-10 max-w-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 border border-primary/30">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-4xl font-black mb-4 leading-tight">Secure Operations Terminal</h1>
                    <p className="text-white/60 font-medium">Authorized staff only. Access terminal for system management, menu modules, and order tracking.</p>
                </div>
            </div>

            {/* Right Interactive Side */}
            <div className="flex-1 flex items-center justify-center p-6 bg-surface relative sm:bg-white rounded-t-3xl md:rounded-none -mt-4 md:mt-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none">
                <div className="w-full max-w-sm transition-all duration-300">
                    <div className="md:hidden flex items-center justify-center mb-6 text-primary">
                        <ShieldCheck size={40} />
                    </div>

                    {/* Step 0: Discovery */}
                    {step === 0 && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-3xl font-black text-secondary leading-tight mb-2">Initialize Session</h2>
                            <p className="text-slate-500 font-medium mb-8">Access administrative modules.</p>
                            
                            <div className="space-y-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full group bg-white border-2 border-slate-100 hover:border-primary/30 p-6 rounded-2xl flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-primary/5 text-left"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <Lock size={24} />
                                    </div>
                                    <div>
                                        <div className="font-black text-secondary">Registered Staff</div>
                                        <div className="text-sm text-slate-400 font-medium">Login with ID & Password</div>
                                    </div>
                                    <ArrowRight className="ml-auto text-slate-200 group-hover:text-primary transition-colors" size={20} />
                                </button>

                                <button
                                    onClick={() => setStep(2)}
                                    className="w-full group bg-white border-2 border-slate-100 hover:border-primary/30 p-6 rounded-2xl flex items-center gap-4 transition-all hover:shadow-lg hover:shadow-primary/5 text-left"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <UserPlus size={24} />
                                    </div>
                                    <div>
                                        <div className="font-black text-secondary">New Staff Entity</div>
                                        <div className="text-sm text-slate-400 font-medium">Register new system user</div>
                                    </div>
                                    <ArrowRight className="ml-auto text-slate-200 group-hover:text-primary transition-colors" size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Existing Staff Login */}
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-black text-secondary leading-tight mb-2">Staff Login</h2>
                            <p className="text-slate-500 font-medium mb-8">Enter your administrative credentials.</p>
                            
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-start gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}
                                <input
                                    type="email"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-medium"
                                    placeholder="Staff Email"
                                    value={loginCreds.id}
                                    onChange={e => setLoginCreds({ ...loginCreds, id: e.target.value })}
                                    required
                                />
                                <input
                                    type="password"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-medium"
                                    placeholder="Password"
                                    value={loginCreds.password}
                                    onChange={e => setLoginCreds({ ...loginCreds, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full py-4 text-lg mt-6 group flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Authenticating...' : 'Access Terminal'}
                                </button>
                            </form>
                            <button onClick={() => setStep(0)} className="w-full text-center mt-6 text-sm font-bold text-slate-400 hover:text-secondary flex items-center justify-center gap-2">
                                <ArrowLeft size={16} /> Back to Selection
                            </button>
                        </div>
                    )}

                    {/* Step 2: Admin Verification */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-black text-secondary leading-tight mb-2">Admin Check</h2>
                            <p className="text-slate-500 font-medium mb-8">Verify official administrative credentials to proceed with registration.</p>
                            
                            <form onSubmit={handleAdminVerify} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-start gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Official Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary transition-all"
                                        placeholder="Enter official name"
                                        value={adminCreds.name}
                                        onChange={e => setAdminCreds({ ...adminCreds, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Official Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary transition-all"
                                        placeholder="••••••••"
                                        value={adminCreds.password}
                                        onChange={e => setAdminCreds({ ...adminCreds, password: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn-primary w-full py-4 text-lg mt-6 flex items-center justify-center gap-2"
                                >
                                    Verify & Continue <ArrowRight size={20} />
                                </button>
                            </form>
                            <button onClick={() => setStep(0)} className="w-full text-center mt-6 text-sm font-bold text-slate-400 hover:text-secondary flex items-center justify-center gap-2">
                                <ArrowLeft size={16} /> Back to Selection
                            </button>
                        </div>
                    )}

                    {/* Step 3: Staff Signup */}
                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <h2 className="text-3xl font-black text-secondary leading-tight mb-2">Register Staff</h2>
                            <p className="text-slate-500 font-medium mb-8">Create your official staff identity.</p>
                            
                            <form onSubmit={handleSignupSubmit} className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-start gap-2">
                                        <span>⚠️</span> {error}
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-medium"
                                        placeholder="Your Full Name"
                                        value={signupData.name}
                                        onChange={e => setSignupData({ ...signupData, name: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="email"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-medium"
                                        placeholder="Staff Email"
                                        value={signupData.email}
                                        onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                                        required
                                    />
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-medium"
                                            placeholder="Create Password"
                                            value={signupData.password}
                                            onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary transition-all placeholder:text-slate-400 placeholder:font-medium"
                                        placeholder="Confirm Password"
                                        value={signupData.confirm}
                                        onChange={e => setSignupData({ ...signupData, confirm: e.target.value })}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn-primary w-full py-4 text-lg mt-6 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Compiling Profile...' : 'Create Staff Identity'}
                                </button>
                            </form>
                            <button onClick={() => setStep(0)} className="w-full text-center mt-6 text-sm font-bold text-slate-400 hover:text-secondary flex items-center justify-center gap-2">
                                <ArrowLeft size={16} /> Cancel Registration
                            </button>
                        </div>
                    )}

                    {/* Step 4: Success Message */}
                    {step === 4 && (
                        <div className="text-center animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-50 rounded-3xl mx-auto flex items-center justify-center border border-green-100 mb-6">
                                <CheckCircle size={40} className="text-green-500" />
                            </div>
                            <h2 className="text-3xl font-black text-secondary leading-tight mb-2">Check Email</h2>
                            <p className="text-slate-500 font-medium mb-8">
                                We've sent a verification link to <span className="text-secondary font-bold">{signupData.email}</span>. Click the link to authorize your staff entity.
                            </p>
                            <button
                                onClick={resetFlow}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                Return to Terminal
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/menu')}
                        className="w-full text-center mt-8 text-xs font-black text-slate-300 hover:text-secondary uppercase tracking-[0.2em] transition-colors"
                    >
                        Return to Public Interface
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficialLogin;
