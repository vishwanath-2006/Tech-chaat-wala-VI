import React, { useEffect } from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import CelebrationRobot from './ui/CelebrationRobot';

function SuccessScreen({ onReset }) {
    useEffect(() => {
        // Auto reset after 10 seconds for kiosk usability
        const timer = setTimeout(() => {
            onReset();
        }, 10000);
        return () => clearTimeout(timer);
    }, [onReset]);

    return (
        <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Absolute Top Right Theme Toggle */}
            <div className="absolute top-6 right-6 z-50">
                
            </div>

            <div className="mb-8 relative rounded-full bg-primary/10 border border-primary/20 p-8 shadow-[0_0_30px_rgba(255,107,0,0.2)]">
                <CheckCircle2 size={64} className="text-primary mb-2" />
                <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-20"></div>
            </div>

            <div className="laser-scan relative w-64 h-48 mb-6 border border-primary/20 bg-black/40 rounded-xl overflow-hidden flex items-center justify-center">
                <CelebrationRobot />
            </div>

            <h1 className="text-3xl font-bold mb-2">Transaction Success</h1>
            <p className="text-slate-400 font-mono text-sm mb-8">Data compiled and sent to kitchen servers.</p>

            <button
                onClick={onReset}
                className="tech-button border border-white/10 px-6 py-3 text-sm flex items-center gap-2 text-white/70 hover:text-white"
                style={{ boxShadow: 'none' }}
            >
                <RefreshCw size={16} /> NEW SESSION
            </button>

            <div className="mt-auto pt-10 pb-4">
                <div className="h-1 w-32 bg-primary/20 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-primary animate-[scan_3s_ease-in-out_infinite]"></div>
                </div>
            </div>
        </div>
    );
}

export default SuccessScreen;
