import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

const AssistantPanel = ({ message, fixed = false, position = 'bottom-right' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [displayMessage, setDisplayMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(false);
            setDisplayMessage('');
            setIsTyping(false);

            const timer = setTimeout(() => {
                setIsVisible(true);
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
                }, 30); // Speed of typing

                return () => clearInterval(typeInterval);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!isVisible && !displayMessage) return null;

    const baseClasses = `flex items-center gap-3 bg-white/90 backdrop-blur-md border border-slate-200 shadow-card p-3 rounded-2xl max-w-[250px] transition-all duration-300 ease-out ${isVisible ? 'opacity-100 animate-bounce-in' : 'opacity-0 translate-y-4 scale-95'
        }`;

    const posClasses = fixed
        ? `fixed z-50 ${position === 'bottom-right' ? 'bottom-28 right-4' : 'bottom-28 left-4'}`
        : 'relative mb-4 mx-auto';

    return (
        <div className={`${baseClasses} ${posClasses}`}>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 relative overflow-hidden">
                <Bot size={20} className="relative z-10 animate-pulse" />
                <div className="absolute inset-0 bg-primary/5 animate-ping opacity-75" />
            </div>
            <div className="flex-1 min-h-[16px]">
                <p className="text-xs font-bold text-secondary leading-tight">
                    {displayMessage}
                    {isTyping && <span className="inline-block w-1.5 h-3 ml-0.5 bg-primary animate-pulse align-middle" />}
                </p>
            </div>

            {/* Little pointer tail */}
            <div className={`absolute w-3 h-3 bg-white border-slate-200 transform rotate-45 ${fixed && position === 'bottom-right' ? '-bottom-1.5 right-6 border-b border-r' : '-bottom-1.5 left-6 border-b border-r'
                }`} />
        </div>
    );
};

export default AssistantPanel;
