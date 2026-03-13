import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, Terminal, Loader2, CheckCircle2, Flame, Package } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

const Processing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { getOrder } = useOrders();
    const orderId = location.state?.orderId;

    const [order, setOrder] = useState(null);

    useEffect(() => {
        const checkStatus = () => {
            if (!orderId) return;
            const currentOrder = getOrder(orderId);
            if (currentOrder) {
                setOrder(currentOrder);
                // Move to success screen as soon as it's ready so user can show QR code
                if (currentOrder.status === 'ready' || currentOrder.status === 'completed') {
                    navigate('/success', { state: { orderId: currentOrder.id } });
                }
            }
        };

        checkStatus();
        // The context re-render will trigger this effect if the dependencies change correctly,
        // but since orders is an array, we might want to ensure we track changes.
        // Actually, the useOrders hook will trigger a re-render of this component 
        // when the orders state in OrderProvider updates.
    }, [orderId, getOrder, navigate]);

    if (!order) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <Loader2 size={48} className="text-primary animate-spin mb-4" />
                <h2 className="text-xl font-bold text-secondary">Locating Transaction...</h2>
            </div>
        );
    }

    const getStatusConfig = () => {
        switch (order.status) {
            case 'awaiting payment':
                return {
                    label: "Awaiting Payment",
                    msg: "Please pay at the counter to confirm your order.",
                    icon: <Terminal className="animate-pulse" />,
                    progress: 10,
                    step: 0
                };
            case 'pending':
                return {
                    label: "Order Received",
                    msg: "Waiting for kitchen confirmation.",
                    icon: <Bot className="animate-bounce" />,
                    progress: 25,
                    step: 1
                };
            case 'accepted':
                return {
                    label: "Accepted",
                    msg: "Kitchen accepted your order.",
                    icon: <CheckCircle2 className="text-blue-500 animate-pulse" />,
                    progress: 45,
                    step: 2
                };
            case 'preparing':
                return {
                    label: "Cooking...",
                    msg: "Cooking your meal now.",
                    icon: <Flame className="text-orange-500 animate-bounce" />,
                    progress: 70,
                    step: 3
                };
            case 'ready':
                return {
                    label: "Ready for Pickup",
                    msg: "Your order is ready for pickup!",
                    icon: <Package className="text-green-500 animate-bounce" />,
                    progress: 100,
                    step: 4
                };
            default:
                return {
                    label: "Processing",
                    msg: "Updating system status...",
                    icon: <Loader2 className="animate-spin" />,
                    progress: 50,
                    step: 2
                };
        }
    };

    const config = getStatusConfig();

    return (
        <div className="min-h-screen fintech-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="blob top-[-10%] left-[-10%] opacity-30"></div>
            <div className="blob bottom-[-5%] right-[-5%] opacity-20 scale-150 animate-delay-2000"></div>

            <div className="z-10 w-full max-w-sm flex flex-col items-center text-center animate-fade-in">
                
                {/* Status Icon */}
                <div className="relative w-36 h-36 mb-10">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse opacity-40"></div>
                    <div className="w-full h-full glass-card rounded-[2.5rem] shadow-2xl border-white/40 flex items-center justify-center relative z-10 overflow-hidden glowing-border active">
                        <div className="text-primary transform scale-[2] drop-shadow-lg">
                            {config.icon}
                        </div>
                    </div>
                </div>

                <div className="inline-block px-5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/50 mb-6 shadow-sm">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Grid Status: Operational</span>
                    </div>
                </div>

                <h1 className="text-4xl font-black text-secondary tracking-tight mb-2 uppercase italic leading-none drop-shadow-sm">
                    {config.label}
                </h1>
                
                <div className="font-mono text-primary font-black tracking-[0.2em] text-[10px] mb-12 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20">
                    TRANSACTION ID: {(order.orderId || order.id)?.slice(0, 8)}
                </div>

                {/* Robot Message Speech Bubble */}
                <div className="relative mb-12 w-full animate-bounce-in">
                    <div className="glass-card p-6 rounded-[2rem] border-white/50 relative shadow-xl">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/60 backdrop-blur-md border-l border-t border-white/40 rotate-45"></div>
                        <p className="text-secondary font-black text-xl leading-tight italic tracking-tight">
                            "{config.msg}"
                        </p>
                    </div>
                </div>

                {/* Progress Visualizer */}
                <div className="w-full space-y-5 mb-12">
                    <div className="w-full bg-white/30 backdrop-blur-sm h-4 rounded-full overflow-hidden flex shadow-inner relative border border-white/40">
                        <div
                            className="bg-primary h-full transition-all duration-1000 ease-out flex relative overflow-hidden shadow-[0_0_20px_rgba(255,122,26,0.5)]"
                            style={{ width: `${config.progress}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-2">
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div 
                                    key={i} 
                                    className={`h-2 rounded-full transition-all duration-700 ${i <= config.step ? 'bg-primary w-8 shadow-[0_0_12px_rgba(255,122,26,0.6)]' : 'bg-white/40 w-3'}`}
                                />
                            ))}
                        </div>
                        <span className="font-mono font-black text-secondary text-base">
                            {config.progress}<span className="text-xs opacity-50 ml-0.5">%</span>
                        </span>
                    </div>
                </div>

                {/* Order Details Mini-Card */}
                <div className="w-full glass-card p-5 rounded-3xl border-white/30 opacity-70 hover:opacity-100 transition-opacity">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
                        <Terminal size={12} /> Active Module Payload
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {order.items?.map((item, idx) => (
                            <span key={idx} className="text-[10px] font-black bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-xl text-secondary border border-white/50 shadow-sm">
                                {item.qty}× {item.name}
                            </span>
                        ))}
                    </div>
                </div>

            </div>

            <div className="absolute bottom-8 font-mono text-[10px] text-slate-400 flex items-center gap-6 z-10 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <span className="flex items-center gap-2 font-black text-secondary tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    Sync Active
                </span>
                <span className="opacity-30">|</span>
                <span className="font-bold">PROTOC_V4_STABLE</span>
            </div>
        </div>
    );
};

export default Processing;
