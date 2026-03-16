import React, { useEffect, useState } from 'react';
import { Bot, ChevronUp, Clock, Package } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';

const OngoingOrderWidget = ({ onClick }) => {
    const { orders } = useOrders();
    const [activeOrder, setActiveOrder] = useState(null);

    useEffect(() => {
        // Find latest non-completed order that belongs to current session/user
        // For local kiosk simplicity, picking the last unresolved order.
        const active = orders.filter(o => o.status !== 'completed' && o.status !== 'ready').pop();
        setActiveOrder(active);
    }, [orders]);

    if (!activeOrder) return null;

    // Pulse animation logic based on status
    const isPreparing = activeOrder.status === 'preparing';

    return (
        <div className="fixed bottom-24 inset-x-0 z-[100] pointer-events-none flex justify-center animate-bounce-in px-4">
            <div 
                onClick={() => onClick(activeOrder.id)}
                className="pointer-events-auto cursor-pointer group"
            >
                <div className={`glass-card rounded-[2.5rem] py-3 pl-4 pr-5 border shadow-2xl flex items-center gap-4 transition-all hover:scale-105 active:scale-95 ${isPreparing ? 'border-primary shadow-primary/40 bg-white/95' : 'border-slate-300 bg-white/90 shadow-xl'}`}>
                {/* Left Icon Area */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-inner ${isPreparing ? 'bg-primary text-white animate-pulse' : 'bg-secondary text-white'}`}>
                    {activeOrder.status === 'pending' || activeOrder.status === 'accepted' ? <Bot size={20} /> : <Package size={20} />}
                </div>

                {/* Status Text Area */}
                <div className="flex flex-col pr-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                        <Clock size={10} /> Track Ongoing
                    </span>
                    <span className={`text-xs font-black uppercase tracking-wider ${isPreparing ? 'text-primary' : 'text-secondary'}`}>
                        {activeOrder.status}
                    </span>
                </div>

                {/* Expand Indicator */}
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center mr-1 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                    <ChevronUp size={14} strokeWidth={3} />
                </div>
            </div>
            </div>
        </div>
    );
};

export default OngoingOrderWidget;
