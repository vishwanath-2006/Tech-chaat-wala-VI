import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Terminal, Loader2, CheckCircle2, Flame, Package } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';

const OrderVisualizerModal = ({ orderId, isOpen, onClose }) => {
    const navigate = useNavigate();
    const { getOrder, orders } = useOrders();
    const [order, setOrder] = useState(null);
    const [progressStats, setProgressStats] = useState({ progress: 0, timeRemaining: 0 });

    useEffect(() => {
        if (!isOpen || !orderId) return;
        
        const currentOrder = getOrder(orderId);
        if (currentOrder) {
            setOrder(currentOrder);
            // Auto close modal and push to success if it's ready or completed
            if (currentOrder.status === 'ready' || currentOrder.status === 'completed') {
                onClose();
                navigate('/success', { state: { orderId: currentOrder.id } });
            }
        }
    }, [orderId, getOrder, navigate, isOpen, orders]);

    useEffect(() => {
        if (!order || !isOpen) return;

        // Progress calc
        const calculateProgress = () => {
             const ts = order.timestamp;
             const elapsedMs = Date.now() - ts;
             const totalPrepMs = (order.prepTime || 3) * 60 * 1000;
             let rawProgress = (elapsedMs / totalPrepMs) * 100;
             
             // Cap at 90% if not ready or completed yet
             if (order.status !== 'ready' && order.status !== 'completed' && rawProgress > 90) {
                 rawProgress = 90;
             }

             if (rawProgress < 0) rawProgress = 0;
             if (rawProgress >= 100) rawProgress = 100;

             let remainingSecs = Math.ceil((totalPrepMs - elapsedMs) / 1000);
             if (remainingSecs < 0) remainingSecs = 0;

             setProgressStats({ progress: Math.floor(rawProgress), timeRemaining: remainingSecs });
        };

        calculateProgress();
        const interval = setInterval(calculateProgress, 1000);
        return () => clearInterval(interval);
    }, [order, isOpen]);

    if (!isOpen) return null;

    if (!order) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
                <Loader2 size={48} className="text-primary animate-spin" />
            </div>
        );
    }

    const getStatusConfig = () => {
        switch (order.status) {
            case 'awaiting payment':
                return { label: "Awaiting Payment", msg: "Please pay at counter overlay.", icon: <Terminal className="animate-pulse" />, step: 0 };
            case 'pending':
                return { label: "Order Received", msg: "Waiting for kitchen confirmation.", icon: <Bot className="animate-bounce" />, step: 1 };
            case 'accepted':
                return { label: "Accepted", msg: "Kitchen accepted your order.", icon: <CheckCircle2 className="text-blue-500 animate-pulse" />, step: 2 };
            case 'preparing':
                return { label: "Cooking...", msg: "Cooking your meal now.", icon: <Flame className="text-orange-500 animate-bounce" />, step: 3 };
            case 'ready':
                return { label: "Ready for Pickup", msg: "Your order is ready!", icon: <Package className="text-green-500 animate-bounce" />, step: 4 };
            default:
                return { label: "Processing", msg: "Updating system status...", icon: <Loader2 className="animate-spin" />, step: 2 };
        }
    };

    const config = getStatusConfig();
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-fade-in">
             <div className="absolute inset-0" onClick={onClose}></div>
             <div className="surface-card w-full max-w-sm rounded-[2.5rem] p-6 text-center relative z-10 shadow-2xl overflow-hidden border border-white/40">
                {/* Close handle */}
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 opacity-60"></div>

                <div className="relative w-24 h-24 mb-6 mx-auto">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse opacity-40"></div>
                    <div className="w-full h-full glass-card rounded-[2rem] shadow-xl border-white/40 flex items-center justify-center relative z-10 glowing-border active">
                        <div className="text-primary transform scale-[1.5] drop-shadow-lg">
                            {config.icon}
                        </div>
                    </div>
                </div>

                <div className="inline-block px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 mb-4 shadow-sm">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Active Sequence
                    </span>
                </div>

                <h1 className="text-2xl font-black text-secondary tracking-tight mb-2 uppercase italic leading-none">{config.label}</h1>
                <div className="font-mono text-primary font-black tracking-[0.2em] text-[10px] mb-8 bg-primary/10 px-3 py-1 rounded-full inline-block">
                    ID: {order.id.slice(0, 8)}
                </div>

                <div className="w-full space-y-4 mb-8">
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex shadow-inner relative">
                        <div className="bg-primary h-full transition-all duration-1000 ease-out flex relative overflow-hidden" style={{ width: `${progressStats.progress}%` }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-1">
                        <div className="flex items-center gap-2">
                             <span className="font-mono font-black text-secondary text-sm">{progressStats.progress}%</span>
                             {progressStats.progress >= 90 && order.status !== 'ready' && (
                                 <span className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">Finalizing...</span>
                             )}
                        </div>
                        <span className="font-mono font-black text-primary text-sm bg-primary/5 px-2 py-1 rounded-lg">
                            {formatTime(progressStats.timeRemaining)}
                        </span>
                    </div>
                </div>

                {/* Module Breakdown Section */}
                <div className="mb-8 text-left glass-card p-4 border-white/20">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Terminal size={12} /> Module Breakdown
                    </h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white/40 p-2 rounded-xl border border-white/30">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-primary text-white text-[10px] font-black rounded-lg flex items-center justify-center">
                                        {item.qty}
                                    </span>
                                    <span className="text-xs font-bold text-secondary">{item.name}</span>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-primary">
                                    ₹{item.price ? item.price * item.qty : '--'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <button onClick={onClose} className="w-full btn-secondary py-4 text-sm font-black uppercase tracking-widest active:scale-95 transition-transform">
                    Hide to Background
                </button>
             </div>
        </div>
    );
};

export default OrderVisualizerModal;
