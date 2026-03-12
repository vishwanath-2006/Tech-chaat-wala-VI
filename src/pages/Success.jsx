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
                if (myOrder.status === 'ready' || myOrder.status === 'completed') remainingSecs = 0;
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
                if (order.status === 'ready' || order.status === 'completed') {
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
        <div className="min-h-screen bg-background flex flex-col items-center pt-8 md:pt-10 pb-8 px-4 md:px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[10%] left-[-20%] w-[60%] h-[60%] bg-success/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-[10%] right-[-20%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />

            <div className="z-10 w-full max-w-[1050px] mx-auto flex flex-col items-center text-center">

                {/* Robot Success Visual Interactive Component */}
                <div className="relative mb-8 mt-16 hover:z-20 flex flex-col items-center">
                    {/* Speech Bubble */}
                    <div
                        className={`absolute bottom-[100%] mb-4 left-1/2 -translate-x-1/2 w-max max-w-[260px] bg-white border border-slate-100 shadow-[0_12px_35px_rgba(0,0,0,0.08)] rounded-[24px] px-5 py-3 text-sm font-bold text-secondary text-center z-30 transition-all ${isBubbleVisible ? 'animate-bounce-in' : 'opacity-0 scale-95 pointer-events-none'}`}
                    >
                        {displayMessage}
                        {isTyping && <span className="inline-block w-1.5 h-3 ml-0.5 bg-primary animate-pulse align-middle" />}
                        {/* Bubble tail */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-slate-100 rotate-45 transform rounded-[2px]" />
                    </div>

                    <div className="absolute inset-0 bg-success/20 rounded-[3rem] blur-xl animate-pulse" />
                    <div
                        className="w-48 h-48 bg-surface rounded-[3rem] shadow-card border-4 border-success/30 flex items-center justify-center relative overflow-hidden group cursor-pointer animate-robot-intro"
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
                            {/* Inner Container for 3D tracking so it doesn't fight CSS keyframes */}
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
                                    alt="Tech Chaat Wala Robot AI"
                                    className="w-full h-full object-cover hue-rotate-15 scale-90"
                                    loading="eager"
                                    style={{
                                        filter: isHovering && isHoverDevice
                                            ? `drop-shadow(${mousePos.x * -15}px ${mousePos.y * -15}px 20px rgba(56, 189, 248, 0.7)) brightness(1.15)`
                                            : '', // Falls back to keyframe animation glow
                                        transition: isHovering ? 'filter 0.1s ease-out' : 'filter 0.5s ease-out',
                                        transform: 'translateZ(20px)'
                                    }}
                                />
                                {/* Dynamic Surface Reflection Glare */}
                                <div
                                    className="absolute inset-0 pointer-events-none rounded-[3rem] mix-blend-overlay"
                                    style={{
                                        opacity: isHovering && isHoverDevice ? 0.8 : 0,
                                        background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 60%)`,
                                        transition: isHovering ? 'opacity 0.2s ease-in, background 0.1s ease-out' : 'opacity 0.5s ease-out',
                                        transform: 'translateZ(30px)' // Pops out above the robot
                                    }}
                                />
                            </div>
                        </div>
                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] rounded-[3rem] pointer-events-none" />

                        {/* Success Badge */}
                        <div className={`absolute -bottom-2 -right-2 bg-success text-white w-14 h-14 rounded-full flex items-center justify-center border-4 border-surface shadow-[0_0_15px_rgba(34,197,94,0.5)] z-10 transition-transform duration-500 delay-100 ${isHovering ? 'scale-110' : 'scale-100'}`}>
                            <CheckCircle2 size={32} />
                        </div>
                    </div>
                </div>

                <div className="mb-2">
                    <div className="inline-block bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-full border border-success/20">
                        TRANSACTION EXECUTED
                    </div>
                </div>

                <h1 className="text-3xl font-black text-secondary tracking-tight mb-2">
                    Order Ready
                </h1>
                <p className="text-textLight text-sm mb-6 max-w-[280px]">
                    Your modular gastronomy request has been fulfilled by the cooking unit.
                </p>

                {/* Real-Time Kitchen Queue & Timer */}
                <div className="w-full flex flex-col md:flex-row gap-4 max-w-md mb-6 animate-fade-in text-left">
                    {/* Pickup Timer */}
                    <div className="surface-card flex-1 p-5 border border-primary/20 bg-primary/5 rounded-2xl relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                        <h3 className="text-xs font-bold text-textLight uppercase tracking-wider mb-2">Estimated Pickup</h3>
                        <div className="flex items-baseline gap-2 mb-2">
                            {timeLeft > 0 ? (
                                <>
                                    <span className="text-3xl font-mono font-black text-primary tracking-tight neon-text-primary">
                                        {formatTime(timeLeft)}
                                    </span>
                                    <span className="text-sm font-bold text-secondary">mins</span>
                                </>
                            ) : (
                                <span className="text-2xl font-black text-success tracking-tight animate-pulse">
                                    READY NOW
                                </span>
                            )}
                        </div>

                        {/* Visual Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-200/50 rounded-full overflow-hidden mt-1">
                            <div
                                className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 0 ? 'bg-success' : 'bg-primary'}`}
                                style={{
                                    width: `${Math.min(100, Math.max(0, 100 - (timeLeft / ((getOrder(passedOrderId)?.prepTime || 3) * 60)) * 100))}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Queue Stats */}
                    {passedOrderId && (
                        <div className="surface-card flex-1 p-5 border border-slate-200 rounded-2xl">
                            <h3 className="text-xs font-bold text-textLight uppercase tracking-wider mb-2">Kitchen Queue</h3>
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-medium text-textLight">Your Position:</span>
                                <span className="font-mono font-bold text-lg text-secondary">#{queueData.position}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-medium text-textLight">Orders Ahead:</span>
                                <span className="font-mono font-bold text-secondary">{queueData.ordersAhead}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order ID Module */}
                <div className="surface-card w-full max-w-md p-6 mb-6 border border-slate-200 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 text-slate-100 opacity-50 transform rotate-12 group-hover:rotate-0 transition-transform">
                        <QrCode size={100} strokeWidth={1} />
                    </div>

                    <p className="text-xs font-bold text-textLight uppercase tracking-wider mb-1 relative z-10">Verification ID</p>
                    <div className="text-3xl font-mono font-black text-primary tracking-widest relative z-10 mb-4 neon-text-primary">
                        {orderId}
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 relative z-10">
                        <p className="text-xs text-secondary font-bold mb-1">Pickup Instructions:</p>
                        <p className="text-xs text-textLight">Wait for your ID on the central projection screen. DO NOT reset the module.</p>
                    </div>
                </div>

                {/* QR Code Interactive Module */}
                <div className="surface-card w-full max-w-md p-6 mb-8 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(255,122,26,0.15)] transition-all duration-300 animate-fade-in shadow-sm" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                    <p className="text-sm font-black text-secondary uppercase tracking-wider mb-4 relative z-10">Scan QR Code for Pickup</p>

                    <div className="relative w-48 h-48 mx-auto bg-white p-3 rounded-xl shadow-inner border border-slate-100 overflow-hidden group-hover:border-primary/30 transition-colors">
                        {orderId && (
                            <QRCode value={orderId} size={256} style={{ width: "100%", height: "100%" }} />
                        )}

                        {/* Laser Animation Element */}
                        <div className="absolute left-0 w-full h-[3px] bg-primary shadow-[0_0_15px_3px_rgba(255,122,26,0.8)] animate-laser-scan z-20 pointer-events-none" />
                    </div>

                    <p className="text-xs text-textLight mt-4 transition-colors group-hover:text-primary font-medium">Scan this code at the pickup machine</p>
                </div>

                <AssistantPanel message="Scan your QR code at the pickup station." />

                <button
                    onClick={handleBackHome}
                    className="btn-outline w-full max-w-md py-4 text-sm gap-2 mt-4"
                >
                    <CheckCircle2 size={18} /> Reinitialize Screen
                </button>
            </div>

            <div className="absolute bottom-6 font-mono text-xs text-slate-400">
                SYSTEM_ID: TERMINAL_42
            </div>
        </div>
    );
};

export default Success;
