import React, { useEffect, useState } from 'react';
import { useOrders } from '../../context/OrderContext';

const StaffOrderVisualizer = ({ orderId }) => {
    const { getOrder } = useOrders();
    const [progress, setProgress] = useState(0);
    const [timeLeftRaw, setTimeLeftRaw] = useState(0);
    const order = getOrder(orderId);

    useEffect(() => {
        if (!order) return;
        const calculateProgress = () => {
            const elapsedMs = Date.now() - order.timestamp;
            const totalPrepMs = (order.prepTime || 3) * 60 * 1000;
            let rawProgress = (elapsedMs / totalPrepMs) * 100;
            
            if (rawProgress > 100) rawProgress = 100;
            if (rawProgress < 0) rawProgress = 0;
            
            setProgress(Math.floor(rawProgress));
            setTimeLeftRaw(Math.ceil((totalPrepMs - elapsedMs) / 1000));
        };

        calculateProgress();
        const interval = setInterval(calculateProgress, 1000);
        return () => clearInterval(interval);
    }, [order]);

    if (!order) return null;

    const formatTime = (seconds) => {
        if (seconds < 0) {
            const m = Math.floor(Math.abs(seconds) / 60);
            const s = Math.abs(seconds) % 60;
            return `+${m}m ${s}s Overdue`;
        }
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')} Left`;
    };

    const isOverdue = timeLeftRaw < 0;

    return (
        <div className="w-full mt-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time Execution</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                    {formatTime(timeLeftRaw)}
                </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                 <div 
                    className={`h-full transition-all duration-1000 ${isOverdue ? 'bg-red-500' : 'bg-primary'}`} 
                    style={{ width: `${progress}%` }} 
                 />
            </div>
        </div>
    );
};

export default StaffOrderVisualizer;
