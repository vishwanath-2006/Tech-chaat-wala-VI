import React, { useState, useEffect } from 'react';

const CelebrationRobot = () => {
    const [phase, setPhase] = useState('entering'); // entering, celebrating, idle
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Enters with pop-up/intro
        const celebrateTimeout = setTimeout(() => {
            setPhase('celebrating');
        }, 800); // Intro takes 0.8s

        // Switch to idle after ~2.5 seconds of celebrating
        const idleTimeout = setTimeout(() => {
            setPhase('idle');
        }, 3300);

        return () => {
            clearTimeout(celebrateTimeout);
            clearTimeout(idleTimeout);
        };
    }, []);

    let animationClass = '';
    if (isHovered) {
        animationClass = 'animate-robot-hover';
    } else {
        if (phase === 'entering') animationClass = 'animate-robot-intro';
        else if (phase === 'celebrating') animationClass = 'animate-robot-celebrate';
        else animationClass = 'animate-robot-idle';
    }

    const message = isHovered ? "Your order is ready!" : "ORDER COMPLETE...";

    return (
        <div
            className="flex flex-col items-center justify-center z-10 w-full h-full relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Speech bubble */}
            <div className={`absolute top-2 transition-opacity duration-300 ${phase !== 'entering' ? 'opacity-100' : 'opacity-0'} z-20`}>
                <div className="bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl px-3 py-1.5 rounded-2xl relative animate-bounce-in">
                    <p className="text-[10px] font-bold text-secondary">{message}</p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-slate-200 rotate-45" />
                </div>
            </div>

            {/* Robot Image Container */}
            <div className={`w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center relative pointer-events-auto ${phase === 'entering' ? 'animate-robot-intro' : ''}`}>
                {/* Apply the movement classes (idle, celebrate, hover) directly to the img so only the robot dances */}
                <img
                    src="/images/hero_robot.png"
                    alt="Robot"
                    className={`w-16 h-16 object-contain relative z-10 ${animationClass}`}
                />
            </div>

            {/* Replace the processing text with base text or hide it when ready */}
            <p className="absolute bottom-2 font-mono text-xs text-primary z-0 opacity-70">
                {phase === 'entering' ? 'PROCESSING MODULES...' : 'READY'}
            </p>
        </div>
    );
};

export default CelebrationRobot;
