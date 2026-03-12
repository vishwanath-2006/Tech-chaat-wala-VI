import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

const OfficialLogin = () => {
    const [credentials, setCredentials] = useState({ id: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { loginOfficial } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        setTimeout(() => {
            const success = loginOfficial(credentials.id, credentials.password);
            if (success) {
                navigate('/admin');
            } else {
                setError('Invalid Official ID or Password. (Hint: admin / admin123)');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Left Graphic Side */}
            <div className="hidden md:flex flex-1 bg-secondary text-white p-12 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30" />
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors w-fit font-bold z-10"
                >
                    <ArrowLeft size={20} /> Terminate Request
                </button>
                <div className="z-10 max-w-sm">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 border border-primary/30">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-4xl font-black mb-4 leading-tight">Secure Operations Terminal</h1>
                    <p className="text-white/60 font-medium">Authorized staff only. Log in to manage menu modules and monitor queue systems.</p>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="flex-1 flex items-center justify-center p-6 bg-surface relative sm:bg-white rounded-t-3xl md:rounded-none -mt-4 md:mt-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] md:shadow-none">
                <div className="w-full max-w-sm">
                    <div className="md:hidden flex items-center justify-center mb-6 text-primary">
                        <ShieldCheck size={40} />
                    </div>

                    <h2 className="text-3xl font-black text-secondary leading-tight mb-2">System Login</h2>
                    <p className="text-slate-500 font-medium mb-8">Enter administrative credentials.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-bold border border-red-100 flex items-start gap-2">
                                <span className="pt-0.5 mt-0">⚠️</span> {error}
                            </div>
                        )}
                        <div>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 placeholder:font-medium"
                                placeholder="Official ID"
                                value={credentials.id}
                                onChange={e => setCredentials({ ...credentials, id: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-4 text-secondary font-bold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400 placeholder:font-medium"
                                placeholder="Password"
                                value={credentials.password}
                                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-4 text-lg mt-6 group flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <span className="animate-pulse">Authenticating...</span>
                            ) : (
                                <>Access Terminal <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate('/menu')}
                        className="w-full text-center mt-6 text-sm font-bold text-slate-400 hover:text-secondary uppercase tracking-widest transition-colors"
                    >
                        Return to Public Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficialLogin;
