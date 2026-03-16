import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Leaf, ScanLine, Terminal, ArrowRight } from 'lucide-react';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse">Initializing System...</p>
                </div>
            </div>
        );
    }
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

                    {user ? (
                        <button
                            onClick={() => navigate('/menu')}
                            className="bg-secondary text-white w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg hover:bg-secondary/90 transition-all shadow-soft active:scale-95 group"
                        >
                            Continue to System
                            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
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
                    )}
                </div>

                {/* Assistant Panel */}
                <AssistantPanel message="Welcome to Tech Chaat Wala." />
            </div>

            {/* Smart Boot Overlay */}
            {isBooting && (
                <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in overflow-hidden">
                    {/* Background Tech Rings */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                        <div className="w-96 h-96 border-8 border-primary rounded-full animate-[spin_4s_linear_infinite] border-t-transparent border-b-transparent" />
                        <div className="absolute w-64 h-64 border-4 border-secondary rounded-full animate-[spin_3s_linear_infinite_reverse] border-l-transparent border-r-transparent" />
                    </div>

                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-8 animate-bounce relative z-10 shadow-[0_0_30px_rgba(255,122,26,0.3)]">
                        <Terminal size={40} />
                        <div className="absolute inset-0 rounded-3xl border-2 border-primary animate-ping opacity-20" />
                    </div>
                    
                    <div className="surface-card p-6 w-full max-w-sm border-primary/20 shadow-neon-blue relative overflow-hidden z-10">
                        {/* Laser Scan Animation */}
                        <div className="absolute left-0 right-0 h-[2px] bg-primary animate-laser-scan blur-[1px] opacity-70 z-20" />
                        
                        <div className="flex items-center gap-3 mb-4 border-b border-primary/10 pb-3">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse delay-75" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse delay-150" />
                            </div>
                            <span className="text-xs font-mono text-textLight uppercase tracking-wider">Terminal / System Boot</span>
                        </div>
                        <div className="font-mono text-sm text-secondary min-h-[40px] flex items-center">
                            <span className="text-primary mr-2">&gt;</span> 
                            <span className="animate-pulse">{bootText}</span>
                            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-ping" />
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{width: `${((BOOT_SEQUENCE.indexOf(bootText) + 1) / BOOT_SEQUENCE.length) * 100}%`, transition: 'width 0.6s ease-out'}} />
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
