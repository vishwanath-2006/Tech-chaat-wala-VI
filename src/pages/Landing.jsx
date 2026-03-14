import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Leaf, ScanLine, Terminal } from 'lucide-react';
import AssistantPanel from '../components/ui/AssistantPanel';
import ProfileDropdown from '../components/ui/ProfileDropdown';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [isBooting, setIsBooting] = useState(false);
    const [bootText, setBootText] = useState('');

    const BOOT_SEQUENCE = [
        "Initializing Kitchen AI...",
        "Loading Recipe Database...",
        "Activating Cooking Modules...",
        "System Ready."
    ];

    // Auto-redirect if already logged in
    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'staff') navigate('/admin');
            else if (user.role === 'customer') navigate('/menu');
        }
    }, [user, loading, navigate]);

    const handleInitialize = () => {
        setIsBooting(true);
        let step = 0;

        const interval = setInterval(() => {
            setBootText(BOOT_SEQUENCE[step]);
            step++;

            if (step >= BOOT_SEQUENCE.length) {
                clearInterval(interval);
                setTimeout(() => {
                    navigate('/menu');
                }, 500); // Small pause before actual navigation
            }
        }, 600); // 600ms per boot step
    };

    if (loading) return null; // Let App.jsx handle the main loading state

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-background overflow-hidden">
            {/* Absolute Top Action Ribbon */}
            <div className="absolute top-6 w-full px-6 flex justify-between items-center z-50 pointer-events-auto">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                    <span className="font-black text-white">v4</span>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => navigate('/official-login')}
                        className="text-[10px] font-black uppercase tracking-widest text-secondary/40 hover:text-primary transition-colors pr-2 border-r border-slate-200"
                    >
                        Staff Portal
                    </button>
                    <ProfileDropdown />
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]" />

            <div className="z-10 w-full max-w-md flex flex-col items-center">
                {/* Robot Hero Art Placeholder */}
                <div className="relative mb-8 group cursor-pointer animate-robot-intro" onClick={handleInitialize}>
                    <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-xl group-hover:bg-primary/30 transition-all duration-500" />
                    <div className="w-48 h-48 bg-surface rounded-[3rem] shadow-soft border-4 border-white flex items-center justify-center relative overflow-hidden transform group-hover:-translate-y-2 transition-transform duration-500 animate-robot-idle">
                        <img
                            src="/images/hero_robot.png"
                            alt="Tech Chaat Wala Robot Assistant"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="eager"
                        />
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] rounded-[3rem] pointer-events-none" />
                    </div>
                    {/* Welcome badge */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-card text-sm font-bold text-secondary whitespace-nowrap border border-slate-100 flex items-center gap-2 z-10">
                        <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        System Online
                    </div>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-secondary tracking-tight mb-3">
                        Tech Chaat Wala
                    </h1>
                    <p className="text-primary font-bold tracking-widest uppercase text-sm mb-2">
                        Future of Street Food
                    </p>
                    <p className="text-textLight text-sm max-w-[250px] mx-auto">
                        Experience the next generation of modular gastronomy and robotics.
                    </p>
                </div>

                {/* Main Action Stack */}
                <div className="w-full space-y-4 mb-12">
                    {/* Guest Entry */}
                    <button
                        onClick={handleInitialize}
                        disabled={isBooting}
                        className="btn-primary btn-bounce w-full py-5 text-lg flex items-center justify-center gap-3 relative overflow-hidden group shadow-neon-blue"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {isBooting ? 'Booting...' : 'Initialize Guest System'}
                            <ScanLine size={20} className={isBooting ? "animate-spin" : "group-hover:animate-pulse"} />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primaryHover to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    <div className="flex gap-4">
                        {/* Customer Login */}
                        <button
                            onClick={() => navigate('/login')}
                            className="flex-1 bg-white border-2 border-slate-100 py-4 rounded-2xl flex items-center justify-center gap-2 text-secondary font-black text-sm hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
                        >
                            <Terminal size={18} />
                            Log In
                        </button>
                        
                        {/* Fast Signup */}
                        <button
                            onClick={() => navigate('/signup')}
                            className="flex-1 bg-secondary text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-black text-sm hover:bg-secondary/90 transition-all shadow-soft active:scale-95"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

                {/* Assistant Panel */}
                <AssistantPanel message="Welcome to Tech Chaat Wala." />
            </div>

            {/* Smart Boot Overlay */}
            {isBooting && (
                <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 animate-bounce">
                        <Terminal size={32} />
                    </div>
                    <div className="surface-card p-6 w-full max-w-sm border-primary/20 shadow-neon-blue">
                        <div className="flex items-center gap-3 mb-4 border-b border-primary/10 pb-3">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <span className="text-xs font-mono text-textLight uppercase tracking-wider">Terminal</span>
                        </div>
                        <div className="font-mono text-sm text-secondary min-h-[20px]">
                            <span className="text-primary mr-2">&gt;</span> {bootText}
                            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                        </div>
                    </div>
                </div>
            )}

            <div className="absolute bottom-6 font-mono text-xs text-slate-400">
                v4.0.2 STABLE_RELEASE
            </div>
        </div>
    );
};

export default Landing;
