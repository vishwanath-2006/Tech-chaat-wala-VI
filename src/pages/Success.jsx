import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, CheckCircle2, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import AssistantPanel from '../components/ui/AssistantPanel';
import { useOrders } from '../context/OrderContext';

const Success = ({ onReset }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const passedOrderId = location.state?.orderId;
    const { getOrder, getQueueStats } = useOrders();
    const [orderId, setOrderId] = useState('');
    const [isHovering, setIsHovering] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHoverDevice, setIsHoverDevice] = useState(true);

    const [timeLeft, setTimeLeft] = useState(0);
    const [queueData, setQueueData] = useState({ ordersAhead: 0, position: 0 });
    const timerInterval = useRef(null);

    const defaultMessage = 'Your order has been processed successfully.';
    const [robotMessage, setRobotMessage] = useState(defaultMessage);
    const [displayMessage, setDisplayMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isBubbleVisible, setIsBubbleVisible] = useState(false);

    const messages = [
        "Your order is secured.",
        "Scan your QR code below.",
        "Transaction verified successfully."
    ];

    useEffect(() => {
        setIsBubbleVisible(false);
        setDisplayMessage('');
        setIsTyping(false);

        const timer = setTimeout(() => {
            setIsBubbleVisible(true);
            setIsTyping(true);
            let currentIndex = 0;

            const typeInterval = setInterval(() => {
                if (currentIndex <= robotMessage.length) {
                    setDisplayMessage(robotMessage.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    setIsTyping(false);
                    clearInterval(typeInterval);
                }
            }, 30);

            return () => clearInterval(typeInterval);
        }, 500);

        return () => clearTimeout(timer);
    }, [robotMessage]);

    useEffect(() => {
        setIsHoverDevice(window.matchMedia("(hover: hover)").matches);

        // Define order ID logic
        if (passedOrderId) {
            setOrderId(passedOrderId);
            // Get initial queue stats
            const stats = getQueueStats(passedOrderId);
            const myOrder = getOrder(passedOrderId);
            if (stats) {
                setQueueData(stats);
            }
            if (myOrder) {
                const elapsedMs = Date.now() - myOrder.timestamp;
                const totalPrepMs = (myOrder.prepTime || 3) * 60 * 1000;
                let remainingSecs = Math.ceil((totalPrepMs - elapsedMs) / 1000);
                if (remainingSecs < 0) remainingSecs = 15;
                if (myOrder.status === 'READY' || myOrder.status === 'COMPLETED') remainingSecs = 0;
                setTimeLeft(remainingSecs);
            }
        } else {
            // Fallback generation
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let id = 'TX-';
            for (let i = 0; i < 6; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            setOrderId(id);
        }
    }, [passedOrderId]);

    // Live countdown timer logic
    useEffect(() => {
        if (timeLeft > 0) {
            timerInterval.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerInterval.current);
                        setRobotMessage("Your order is ready for pickup!");
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerInterval.current) clearInterval(timerInterval.current);
        };
    }, [timeLeft]);

    // Live polling for queue status changes if it's a real order
    useEffect(() => {
        if (!passedOrderId) return;

        const pollInterval = setInterval(() => {
            const order = getOrder(passedOrderId);
            if (order) {
                if (order.status === 'READY' || order.status === 'COMPLETED') {
                    setTimeLeft(0);
                    setRobotMessage("Your order is ready for pickup!");
                } else {
                    const stats = getQueueStats(passedOrderId);
                    if (stats && stats.position !== queueData.position) {
                        setQueueData(stats);
                    }

                    // Sync timer with actual order prep time (e.g. if admin changed it)
                    const elapsedMs = Date.now() - order.timestamp;
                    const totalPrepMs = (order.prepTime || 3) * 60 * 1000;
                    let calculatedRemaining = Math.ceil((totalPrepMs - elapsedMs) / 1000);

                    if (calculatedRemaining < 0) calculatedRemaining = 15;

                    setTimeLeft(prev => {
                        // Only force update if discrepancy is large to avoid jerky countdowns
                        if (Math.abs(prev - calculatedRemaining) > 10) {
                            if (calculatedRemaining > prev + 30) {
                                setRobotMessage("Display Update: Preparation time was adjusted by module operators.");
                            }
                            return calculatedRemaining;
                        }
                        return prev;
                    });
                }
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [passedOrderId, queueData.position]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleMouseMove = (e) => {
        if (!isHoverDevice) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePos({
            x: x / (rect.width / 2),
            y: y / (rect.height / 2)
        });
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (isHoverDevice) {
            setMousePos({ x: 0, y: 0 });
        }
    };

    const handleBackHome = () => {
        if (onReset) onReset();
        navigate('/');
    };

    return (
        <div className="min-h-screen fintech-bg flex flex-col items-center pt-8 md:pt-10 pb-8 px-4 md:px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="blob top-[-10%] left-[-20%] opacity-30"></div>
            <div className="blob bottom-[-10%] right-[-20%] opacity-20 scale-125 animate-delay-2000"></div>

            <div className="z-10 w-full max-w-md mx-auto flex flex-col items-center text-center animate-fade-in">

                {/* Robot Success Visual Interactive Component */}
                <div className="relative mb-10 mt-12 hover:z-20 flex flex-col items-center">
                    {/* Speech Bubble */}
                    <div
                        className={`absolute bottom-[100%] mb-4 left-1/2 -translate-x-1/2 w-max max-w-[260px] glass-card shadow-2xl rounded-[24px] px-6 py-4 text-sm font-black text-secondary text-center z-30 transition-all border-white/50 ${isBubbleVisible ? 'animate-bounce-in' : 'opacity-0 scale-95 pointer-events-none'}`}
                    >
                        {displayMessage}
                        {isTyping && <span className="inline-block w-1.5 h-3 ml-1 bg-primary animate-pulse align-middle" />}
                        {/* Bubble tail */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/40 backdrop-blur-md border-b border-r border-white/40 rotate-45 transform rounded-[2px]" />
                    </div>

                    <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-2xl animate-pulse opacity-40"></div>
                    <div
                        className="w-44 h-44 glass-card rounded-[3.5rem] shadow-2xl border-white/40 flex items-center justify-center relative overflow-hidden group cursor-pointer animate-robot-intro glowing-border active"
                        style={{ perspective: '1000px' }}
                        onMouseEnter={() => {
                            if (!isHovering) {
                                setIsHovering(true);
                                setRobotMessage(messages[Math.floor(Math.random() * messages.length)]);
                            }
                        }}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                    >
                        <div className={`w-full h-full relative z-0 ${(isHovering && !isHoverDevice) ? 'animate-robot-hover' : (!isHovering ? 'animate-robot-idle' : '')}`} style={{ transformStyle: 'preserve-3d' }}>
                            <div
                                className="w-full h-full relative flex items-center justify-center z-[1]"
                                style={{
                                    transform: isHovering && isHoverDevice
                                        ? `rotateX(${mousePos.y * -15}deg) rotateY(${mousePos.x * 15}deg) scale3d(1.05, 1.05, 1.05)`
                                        : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                                    transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
                                    transformStyle: 'preserve-3d'
                                }}
                            >
                                <img
                                    src="/images/hero_robot.png"
                                    alt="Robot"
                                    className="w-full h-full object-contain scale-[0.8] drop-shadow-2xl"
                                    loading="eager"
                                    style={{
                                        filter: isHovering && isHoverDevice
                                            ? `drop-shadow(${mousePos.x * -15}px ${mousePos.y * -15}px 25px rgba(255, 122, 26, 0.6))`
                                            : '',
                                        transition: isHovering ? 'filter 0.1s ease-out' : 'filter 0.5s ease-out',
                                        transform: 'translateZ(20px)'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Success Badge */}
                        <div className={`absolute bottom-4 right-4 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/50 shadow-lg z-10 transition-transform duration-500 ${isHovering ? 'scale-110' : 'scale-100'}`}>
                            <CheckCircle size={24} strokeWidth={3} />
                        </div>
                    </div>
                </div>

                <div className="mb-3">
                    <div className="inline-block bg-white/40 backdrop-blur-md text-secondary text-[10px] font-black px-4 py-1.5 rounded-full border border-white/50 shadow-sm uppercase tracking-[0.2em]">
                        Transaction Executed
                    </div>
                </div>

                <h1 className="text-4xl font-black text-secondary tracking-tight mb-3 italic">
                    {timeLeft <= 0 ? "Module Ready" : "Initializing..."}
                </h1>
                <p className="text-slate-500 text-sm font-bold mb-10 max-w-[300px] leading-relaxed">
                    Your modular request has been fulfilled. Collect your items at the primary exit.
                </p>

                {/* Real-Time Kitchen Queue & Timer */}
                <div className="w-full flex gap-4 mb-8">
                    {/* Pickup Timer */}
                    <div className="glass-card flex-1 p-6 border-white/50 relative overflow-hidden flex flex-col justify-center text-left">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Est. Delivery</h3>
                        <div className="flex items-baseline gap-2 mb-3">
                            {timeLeft > 0 ? (
                                <>
                                    <span className="text-3xl font-mono font-black text-primary tracking-tighter">
                                        {formatTime(timeLeft)}
                                    </span>
                                    <span className="text-[10px] font-black text-secondary uppercase opacity-60">Secs</span>
                                </>
                            ) : (
                                <span className="text-2xl font-black text-green-500 tracking-tight animate-pulse uppercase italic">
                                    ACTIVE NOW
                                </span>
                            )}
                        </div>

                        <div className="w-full h-2 bg-white/40 rounded-full overflow-hidden relative shadow-inner">
                            <div
                                className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'bg-primary shadow-[0_0_10px_rgba(255,122,26,0.6)]'}`}
                                style={{
                                    width: `${Math.min(100, Math.max(0, 100 - (timeLeft / ((getOrder(passedOrderId)?.prepTime || 3) * 60)) * 100))}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Queue Stats */}
                    {passedOrderId && (
                        <div className="glass-card flex-1 p-6 border-white/50 text-left">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Grid Queue</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Position</span>
                                    <span className="font-mono font-black text-lg text-secondary">#{queueData.position}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Wait</span>
                                    <span className="font-mono font-black text-secondary">{queueData.ordersAhead}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order ID & QR Module */}
                <div className="glass-card w-full p-8 mb-10 border-white/50 relative overflow-hidden group shadow-2xl">
                    <div className="absolute -right-6 -top-6 text-slate-200/40 transform rotate-12">
                        <QrCode size={140} strokeWidth={1} />
                    </div>

                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2 text-left relative z-10">Verification Protocol</p>
                    <div className="text-4xl font-mono font-black text-primary tracking-[0.2em] relative z-10 mb-8 text-left drop-shadow-md italic">
                        {orderId}
                    </div>

                    <div className="relative w-56 h-56 mx-auto bg-white p-4 rounded-3xl shadow-inner border-4 border-slate-100 overflow-hidden mb-6">
                        {orderId && (
                            <QRCode value={orderId} size={256} style={{ width: "100%", height: "100%", opacity: 0.9 }} />
                        )}
                        {/* Laser Animation Element */}
                        <div className="absolute left-0 w-full h-[4px] bg-primary shadow-[0_0_20px_4px_rgba(255,122,26,0.8)] animate-[scanning-line_2s_infinite_ease-in-out] z-20 pointer-events-none"></div>
                    </div>

                    <button 
                        onClick={handleBackHome}
                        className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-4 group transition-all relative overflow-hidden shadow-[0_15px_30px_rgba(255,122,26,0.3)]"
                    >
                         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <CheckCircle2 size={24} className="relative z-10" />
                        <span className="relative z-10 uppercase font-black tracking-[0.2em] italic">Reinitialize Terminal</span>
                    </button>
                </div>

            </div>

            <div className="absolute bottom-10 font-mono text-[10px] px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-slate-500 font-black tracking-widest uppercase flex items-center gap-4">
                <span>Terminal_42</span>
                <span className="opacity-30">|</span>
                <span className="text-secondary">Ready for Handover</span>
            </div>
        </div>
    );
};

export default Success;
