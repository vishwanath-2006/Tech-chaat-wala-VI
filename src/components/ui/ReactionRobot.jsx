import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

const MESSAGES = {
    add: [
        "Wooow! Great choice!",
        "Yummy pick!",
        "Excellent module selection."
    ],
    sold_out: [
        "Oh no! That item is unavailable.",
        "Module currently offline."
    ]
};

const ReactionRobot = ({ trigger, eventType = 'add' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [displayMessage, setDisplayMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [animationClass, setAnimationClass] = useState('');

    useEffect(() => {
        if (trigger > 0) {
            // Pick message based on eventType
            const possibleMsgs = MESSAGES[eventType] || MESSAGES['add'];
            setMessage(possibleMsgs[Math.floor(Math.random() * possibleMsgs.length)]);

            setIsVisible(true);
            setAnimationClass('animate-robot-pop-up');

            // Delay for reaction
            const reactionTimeout = setTimeout(() => {
                if (eventType === 'sold_out') {
                    // Tilt or sad
                    setAnimationClass('animate-robot-hover grayscale');
                } else {
                    const reactions = ['animate-robot-jump', 'animate-robot-happy', 'animate-robot-hover'];
                    setAnimationClass(reactions[Math.floor(Math.random() * reactions.length)]);
                }
            }, 600);

            // Hide after 3.5 seconds
            const hideTimeout = setTimeout(() => {
                setAnimationClass('animate-robot-pop-down');
                setTimeout(() => setIsVisible(false), 500);
            }, 3500);

            return () => {
                clearTimeout(reactionTimeout);
                clearTimeout(hideTimeout);
            };
        }
    }, [trigger, eventType]);

    // Typing effect logic
    useEffect(() => {
        if (isVisible && message) {
            setDisplayMessage('');
            setIsTyping(true);
            let currentIndex = 0;

            const typeInterval = setInterval(() => {
                if (currentIndex <= message.length) {
                    setDisplayMessage(message.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    setIsTyping(false);
                    clearInterval(typeInterval);
                }
            }, 30);

            return () => clearInterval(typeInterval);
        }
    }, [isVisible, message]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 right-4 z-[100] pointer-events-none flex flex-col items-center">
            {/* Speech Bubble */}
            <div className={`mb-2 bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl p-3 rounded-2xl max-w-[180px] animate-bounce-in relative pointer-events-auto`}>
                <p className="text-[11px] font-bold text-secondary leading-tight">
                    {displayMessage}
                    {isTyping && <span className="inline-block w-1 h-3 ml-0.5 bg-primary animate-pulse align-middle" />}
                </p>
                {/* Tail */}
                <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-slate-200 rotate-45 transform" />
            </div>

            {/* Robot Container */}
            <div className={`w-28 h-28 bg-surface rounded-[2rem] shadow-card border-4 border-white flex items-center justify-center relative overflow-hidden pointer-events-auto ${animationClass}`}>
                <div className="absolute inset-0 bg-primary/10 blur-xl animate-pulse" />
                <img
                    src="/images/hero_robot.png"
                    alt="Reaction Robot"
                    className="w-20 h-20 object-cover animate-robot-idle"
                />
                <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.05)] rounded-[2rem]" />

                {/* Glow around eyes (simulated via drop-shadow) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            </div>

            {/* Base hiding element */}
            <div className="h-2 w-full" />
        </div>
    );
};

export default ReactionRobot;
