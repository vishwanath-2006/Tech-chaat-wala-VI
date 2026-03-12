import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, Terminal, Loader2 } from 'lucide-react';

const Processing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    const [step, setStep] = useState(0);

    const STEPS = [
        "Initializing kitchen system...",
        "Preparing fresh ingredients...",
        "Heating cooking module...",
        "Cooking in progress...",
        "Packaging meal...",
        "Order ready for pickup!"
    ];

    useEffect(() => {
        // 6 stages -> ~6 seconds total processing time = 1000ms per stage
        const interval = setInterval(() => {
            setStep(prev => {
                if (prev < STEPS.length - 1) return prev + 1;
                clearInterval(interval);
                // When done, move to success with the orderId
                setTimeout(() => navigate('/success', { state: { orderId } }), 1000);
                return prev;
            });
        }, 1100);

        return () => clearInterval(interval);
    }, [navigate, orderId]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Backgrounds */}
            <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />

            <div className="z-10 w-full max-w-sm flex flex-col items-center text-center animate-fade-in">

                <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping opacity-50" />
                    <div className="w-full h-full bg-surface rounded-[2rem] shadow-neon-blue border-[3px] border-primary/40 flex items-center justify-center relative z-10">
                        <Loader2 size={48} className="text-primary animate-spin" />
                    </div>
                </div>

                <h1 className="text-2xl font-black text-secondary tracking-tight mb-2 uppercase">
                    Cooking Module
                </h1>
                <p className="font-mono text-primary font-bold tracking-widest text-sm mb-10">
                    ACTIVATED
                </p>

                {/* Progress Visualizer */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex shadow-inner mb-6 relative border border-slate-200">
                    <div
                        className="bg-primary h-full transition-all duration-700 ease-out flex relative overflow-hidden animate-progress-particles shadow-[0_0_10px_rgba(255,122,26,0.8)]"
                        style={{ width: `${Math.max(5, ((step + 1) / STEPS.length) * 100)}%` }}
                    />
                </div>

                <div className="flex w-full items-center justify-between text-xs font-mono mb-4 px-1">
                    <span className="text-textLight flex items-center gap-1 opacity-70">
                        <Terminal size={12} /> {STEPS[step]}
                    </span>
                    <span className="font-bold text-secondary">
                        {Math.floor(((step + 1) / STEPS.length) * 100)}%
                    </span>
                </div>

            </div>

            <div className="absolute bottom-6 font-mono text-xs text-slate-400">
                AI_KITCHEN_SYS V4.2
            </div>
        </div>
    );
};

export default Processing;
