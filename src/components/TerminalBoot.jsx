import React, { useEffect, useState } from 'react';

const bootSequence = [
    "INITIALIZING KERNEL...",
    "LOADING CYBER-STREET DB [v4.0.2]...",
    "ESTABLISHING SECURE CONNECTION...",
    "BYPASSING FIREWALLS...",
    "MOUNTING MENU MODULES...",
    "SYSTEM OPTIMAL. READY."
];

function TerminalBoot({ onComplete }) {
    const [lines, setLines] = useState([]);

    useEffect(() => {
        let currentLine = 0;

        const interval = setInterval(() => {
            if (currentLine < bootSequence.length) {
                setLines(prev => [...prev, bootSequence[currentLine]]);
                currentLine++;
            } else {
                clearInterval(interval);
                setTimeout(onComplete, 800);
            }
        }, 400);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-background flex flex-col p-6 font-mono text-primary">
            <div className="flex-1 mt-12">
                {lines.map((line, i) => (
                    <div key={i} className="mb-2 opacity-90 typing-effect">
                        <span className="opacity-50 mr-2">{`>`}</span> {line}
                    </div>
                ))}
                {lines.length < bootSequence.length && (
                    <div className="animate-pulse opacity-90">
                        <span className="opacity-50 mr-2">{`>`}</span> _
                    </div>
                )}
            </div>
        </div>
    );
}

export default TerminalBoot;
