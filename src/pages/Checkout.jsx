import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, CreditCard, ShieldCheck, Trash2, X, Smartphone, QrCode, Banknote, Landmark, Info, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useMenu } from '../context/MenuContext';
import { useOrders } from '../context/OrderContext';

const Checkout = ({ cart, updateCart }) => {
    const navigate = useNavigate();
    const { menuData } = useMenu();
    const { addOrder } = useOrders();

    const [checkoutStep, setCheckoutStep] = useState('summary'); // summary | collect-name | payment-choice | upi-apps | qr-code | confirming
    const [selectedUPI, setSelectedUPI] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingMsg, setProcessingMsg] = useState('');
    const [guestName, setGuestName] = useState('');

    const cartItems = Object.entries(cart).map(([id, qty]) => {
        const item = menuData.find(i => i.id === id);
        return { ...item, qty };
    }).filter(item => item && item.name);

    // Determine available addons
    const availableAddons = menuData.filter(item => item.category === 'Mini-addons' && !cart[item.id]);

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    const platformFee = 15; // Gas fee equivalent
    const cloudTax = Math.round(subtotal * 0.05); // 5% Cloud Storage Tax (GST)
    const grandTotal = subtotal + platformFee + cloudTax;

    const handleConfirmPayment = async (method, status = 'paid') => {
        setIsProcessing(true)
        setProcessingMsg(method === 'Counter' ? "Registering order..." : "Finalizing transaction...");

        try {
            // Calculate prep time: longest item + 1 min for packaging
            const maxItemPrepTime = Math.max(1, ...cartItems.map(i => i.prepTime || 3));
            const basePrepTime = maxItemPrepTime + 1;

            // Get user info if available
            const { data: { user } } = await supabase.auth.getUser();
            const customerName = user ? (user.user_metadata?.name || user.user_metadata?.full_name || user.email) : guestName;

            // Direct Supabase Insertion matching the exact table schema provided
            const { data, error } = await supabase
                .from("orders")
                .insert([
                    {
                        user_id: user?.id,
                        customer_name: customerName,
                        items: cartItems.map(i => ({ name: i.name, qty: i.qty })),
                        total_price: Number(grandTotal),
                        payment_mode: method || "cash",
                        payment_status: status.toLowerCase() || "pending",
                        order_status: "pending"
                    }
                ])
                .select();

            if (error) {
                console.error("Supabase insert error:", error.message, error.details);
                setProcessingMsg("Error finalizing transaction. Details: " + error.message);
                setIsProcessing(false);
                return;
            }

            const orderId = data[0].id;
            console.log("Order confirmed with ID:", orderId);

            // Clear customer cart
            updateCart('ALL_CLEAR', 0);

            // Navigate to processing (live status tracker)
            setTimeout(() => {
                navigate('/processing', { state: { orderId } });
            }, 1000);
        } catch (error) {
            console.error("Checkout error:", error);
            setProcessingMsg("System error. Transaction failed.");
            setIsProcessing(false);
        }
    };

    const handleUPISelect = (app) => {
        setSelectedUPI(app);
        setCheckoutStep('confirming');
        setProcessingMsg(`Redirecting to ${app}...`);
        
        setTimeout(() => {
            setProcessingMsg("Payment Successful! Sending order to kitchen...");
            setTimeout(() => {
                handleConfirmPayment('UPI', 'Paid');
            }, 1500);
        }, 2000);
    };

    const handleQRConfirm = () => {
        setCheckoutStep('confirming');
        setProcessingMsg("Verifying QR Transaction...");
        setTimeout(() => {
            setProcessingMsg("Payment Verified! Order assigned.");
            setTimeout(() => {
                handleConfirmPayment('QR-UPI', 'Paid');
            }, 1500);
        }, 2000);
    };

    if (cartItems.length === 0 && checkoutStep === 'summary') {
        return (
            <div className="min-h-screen bg-background flex flex-col p-6 items-center justify-center">
                <div className="surface-card p-8 rounded-3xl flex flex-col items-center max-w-sm w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl mb-4">🛒</div>
                    <h2 className="text-xl font-bold text-secondary mb-2">Queue Empty</h2>
                    <p className="text-textLight text-sm mb-6">Initialize a transaction by adding modules from the menu.</p>
                    <button onClick={() => navigate('/menu')} className="btn-primary w-full py-4 text-sm">
                        Return to Menu
                    </button>
                </div>
            </div>
        );
    }

    // --- RENDER STEPS ---

    if (checkoutStep === 'confirming') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping opacity-40"></div>
                    <Loader2 size={48} className="text-primary animate-spin relative z-10" />
                </div>
                <h2 className="text-2xl font-black text-secondary mb-4 uppercase tracking-tight">{processingMsg}</h2>
                <p className="text-textLight font-mono text-sm max-w-xs">DO NOT CLOSE OR REFRESH THIS INTERFACE</p>
                <div className="mt-12 w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full animate-progress-fast shadow-[0_0_10px_rgba(255,122,26,0.5)]"></div>
                </div>
            </div>
        );
    }

    if (checkoutStep === 'collect-name') {
        const handleNameSubmit = (e) => {
            e.preventDefault();
            if (guestName.trim()) {
                setCheckoutStep('payment-choice');
            }
        };

        return (
            <div className="min-h-screen fintech-bg flex flex-col relative">
                <div className="blob top-[-10%] left-[-10%]"></div>
                <header className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-xl sticky top-0 z-40">
                    <button onClick={() => setCheckoutStep('summary')} className="flex items-center gap-2 text-secondary font-bold">
                        <ChevronLeft size={20} /> Back
                    </button>
                </header>
                <main className="p-6 max-w-md mx-auto w-full z-10 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/40 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-inner mb-8">
                        <img src="/images/hero_robot.png" alt="Robot" className="w-14 h-14 object-contain" />
                    </div>
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-secondary mb-2 tracking-tight">Identity Request</h1>
                        <p className="text-textLight text-sm font-medium opacity-80">Please provide your name for order tracking</p>
                    </div>
                    <form onSubmit={handleNameSubmit} className="w-full space-y-6">
                        <div className="glass-card p-6 border-2 border-white/30">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Customer Name</label>
                            <input 
                                required 
                                type="text" 
                                value={guestName} 
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full bg-white/50 border border-slate-200 rounded-2xl p-4 text-secondary font-bold focus:border-primary outline-none transition-all placeholder:text-slate-300"
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full py-5 text-sm uppercase tracking-widest font-black flex items-center justify-center gap-3">
                            Continue to Payment <ArrowRight size={20} />
                        </button>
                    </form>
                </main>
            </div>
        );
    }

    if (checkoutStep === 'payment-choice') {
        return (
            <div className="min-h-screen fintech-bg flex flex-col relative">
                {/* Background Blobs */}
                <div className="blob top-[-10%] left-[-10%]"></div>
                <div className="blob bottom-[-10%] right-[-10%] animate-delay-2000" style={{ animationDelay: '2s' }}></div>
                
                <header className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-xl sticky top-0 z-40">
                    <button onClick={() => setCheckoutStep('summary')} className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors">
                        <ChevronLeft size={20} /> Back
                    </button>
                </header>
                
                <main className="p-6 max-w-md mx-auto w-full z-10 flex flex-col items-center">
                    {/* Robot Assistant */}
                    <div className="relative mb-6 group cursor-pointer animate-robot-intro">
                        {/* Speech Bubble */}
                        <div className="absolute bottom-[100%] mb-4 left-1/2 -translate-x-1/2 w-max max-w-[200px] glass-card px-4 py-2 text-xs font-bold text-secondary text-center shadow-lg animate-bounce-in">
                            Choose your payment method.
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/60 border-b border-r border-white/30 rotate-45 transform"></div>
                        </div>
                        <div className="w-16 h-16 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all">
                            <img src="/images/hero_robot.png" alt="Robot" className="w-12 h-12 object-contain animate-robot-idle group-hover:animate-robot-hover" />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-secondary mb-2 tracking-tight">Choose Payment</h1>
                        <p className="text-textLight text-sm font-medium opacity-80">Select your preferred execution protocol</p>
                    </div>

                    <div className="space-y-6 w-full">
                        {/* Pay Online Card */}
                        <button 
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                const ripple = document.createElement('span');
                                ripple.className = 'ripple';
                                ripple.style.left = `${x}px`;
                                ripple.style.top = `${y}px`;
                                e.currentTarget.appendChild(ripple);
                                setTimeout(() => ripple.remove(), 600);
                                setTimeout(() => setCheckoutStep('upi-apps'), 200);
                            }}
                            className="w-full glass-card p-6 flex flex-col items-start gap-4 hover:border-primary/50 group transition-all active:scale-[0.98] border-2 border-white/30 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center w-full">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                                    <Smartphone size={28} />
                                </div>
                                <div className="flex gap-2">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-4 opacity-40 group-hover:opacity-100 transition-opacity" alt="GP" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" className="h-4 opacity-40 group-hover:opacity-100 transition-opacity" alt="PP" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/BHIM_logo.svg" className="h-4 opacity-40 group-hover:opacity-100 transition-opacity" alt="UPI" />
                                </div>
                            </div>
                            <div className="text-left w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-extrabold text-secondary text-2xl tracking-tight">Pay Online</h3>
                                    <ArrowRight size={22} className="text-slate-400 group-hover:text-primary group-hover:translate-x-2 transition-all" />
                                </div>
                                <p className="text-textLight text-sm font-semibold opacity-70">UPI, Wallet, QR Code</p>
                            </div>
                        </button>

                        {/* Pay at Counter Card */}
                        <button 
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = e.clientX - rect.left;
                                const y = e.clientY - rect.top;
                                const ripple = document.createElement('span');
                                ripple.className = 'ripple';
                                ripple.style.left = `${x}px`;
                                ripple.style.top = `${y}px`;
                                e.currentTarget.appendChild(ripple);
                                setTimeout(() => ripple.remove(), 600);
                                setTimeout(() => handleConfirmPayment('Counter', 'pending'), 200);
                            }}
                            className="w-full glass-card p-6 flex flex-col items-start gap-4 hover:border-secondary/50 group transition-all active:scale-[0.98] border-2 border-white/30 relative overflow-hidden"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all shadow-inner">
                                <Banknote size={28} />
                            </div>
                            <div className="text-left w-full">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-extrabold text-secondary text-2xl tracking-tight">Pay at Counter</h3>
                                    <ArrowRight size={22} className="text-slate-400 group-hover:text-secondary group-hover:translate-x-2 transition-all" />
                                </div>
                                <p className="text-textLight text-sm font-semibold opacity-70">Cash or Physical Card</p>
                            </div>
                        </button>
                    </div>

                    <div className="mt-12 glass-card bg-white/30 p-5 flex items-start gap-4 border border-white/40 shadow-sm max-w-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-100/50 flex items-center justify-center shrink-0">
                            <Info size={18} className="text-slate-400" />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-bold">
                            <span className="text-secondary">Official Protocol:</span> Counter payments require staff intervention for kitchen slot allocation.
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    if (checkoutStep === 'upi-apps') {
        const UPI_APPS = [
            { name: 'Google Pay', icon: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg', color: 'bg-white' },
            { name: 'PhonePe', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg', color: 'bg-white' },
            { name: 'Paytm', icon: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg', color: 'bg-white' },
            { name: 'BHIM UPI', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/BHIM_logo.svg', color: 'bg-white' }
        ];

        return (
            <div className="min-h-screen fintech-bg flex flex-col">
                <div className="blob top-[-5%] right-[-5%] opacity-30"></div>
                
                <header className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-xl sticky top-0 z-40">
                    <button onClick={() => setCheckoutStep('payment-choice')} className="flex items-center gap-2 text-secondary font-bold">
                        <ChevronLeft size={20} /> Back
                    </button>
                </header>
                
                <main className="p-6 max-w-md mx-auto w-full z-10">
                    <h2 className="text-2xl font-black text-secondary mb-6 tracking-tight">Select UPI App</h2>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {UPI_APPS.map(app => (
                            <button 
                                key={app.name}
                                onClick={() => handleUPISelect(app.name)}
                                className="glass-card p-6 flex flex-col items-center gap-4 hover:border-primary/50 transition-all active:scale-95 group relative overflow-hidden"
                            >
                                <div className="w-16 h-12 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all p-1">
                                    <img src={app.icon} alt={app.name} className="max-h-full max-w-full drop-shadow-sm" />
                                </div>
                                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{app.name}</span>
                                
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        ))}
                    </div>

                    <div className="relative mb-10">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/40"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent backdrop-blur-sm px-4 text-slate-400 font-bold">Protocol Diversion</span></div>
                    </div>

                    <button 
                        onClick={() => setCheckoutStep('qr-code')}
                        className="w-full glass-card hover:border-primary/50 flex items-center justify-center gap-4 py-5 text-secondary font-black uppercase tracking-wider shadow-lg active:scale-[0.98]"
                    >
                        <QrCode size={24} className="text-primary" />
                        Scan Universal QR
                    </button>
                </main>
            </div>
        );
    }

    if (checkoutStep === 'qr-code') {
        return (
            <div className="min-h-screen fintech-bg flex flex-col">
                <div className="blob top-[20%] right-[-10%] scale-150 opacity-40"></div>
                
                <header className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-xl sticky top-0 z-40">
                    <button onClick={() => setCheckoutStep('upi-apps')} className="flex items-center gap-2 text-secondary font-bold">
                        <ChevronLeft size={20} /> Back
                    </button>
                </header>
                
                <main className="p-6 max-w-md mx-auto w-full text-center z-10">
                    <h2 className="text-2xl font-black text-secondary mb-2 tracking-tight">Universal UPI QR</h2>
                    <p className="text-textLight text-sm font-bold opacity-70 mb-8">Scan with GPay, PhonePe, or BHIM</p>

                    <div className="glass-card p-8 inline-block mb-10 relative glowing-border active shadow-2xl">
                        {/* Mock QR Code */}
                        <div className="w-56 h-56 bg-slate-900 rounded-2xl p-4 flex flex-wrap gap-1 relative overflow-hidden">
                            {Array.from({ length: 49 }).map((_, i) => (
                                <div key={i} className={`w-6 h-6 rounded-sm ${Math.random() > 0.4 ? 'bg-white' : 'bg-slate-800'}`}></div>
                            ))}
                            
                            {/* Scanning Light Animation */}
                            <div className="absolute left-0 w-full h-1 bg-primary/80 shadow-[0_0_15px_rgba(255,122,26,0.8)] animate-[scanning-line_2s_infinite_ease-in-out]"></div>
                            
                            <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-xl p-2 flex items-center justify-center shadow-lg border border-slate-200">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/BHIM_logo.svg" alt="UPI" className="w-full h-full" />
                            </div>
                        </div>
                    </div>

                    <div className="glass-card bg-white/40 p-6 mb-8 border border-white/50 shadow-sm">
                        <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-1">Amount to Execute</div>
                        <div className="text-4xl font-black text-secondary font-mono tracking-tighter">₹{grandTotal}</div>
                    </div>

                    {/* Expiry Timer Mock */}
                    <div className="flex items-center justify-center gap-2 text-sm font-bold text-slate-500 mb-10">
                        <Loader2 size={16} className="animate-spin text-primary" />
                        <span>QR expires in <span className="text-secondary">02:45</span></span>
                    </div>

                    <button 
                        onClick={handleQRConfirm}
                        className="btn-primary w-full py-5 text-sm uppercase tracking-widest font-black shadow-[0_10px_30px_rgba(255,122,26,0.4)] group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10">I've Completed Payment</span>
                    </button>
                    
                    <p className="text-slate-400 text-xs font-bold mt-6 animate-pulse">Waiting for transaction signal...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen fintech-bg flex flex-col animate-fade-in relative pb-32">
            {/* Background Blobs */}
            <div className="blob top-[-5%] left-[-10%] opacity-20"></div>
            <div className="blob bottom-[10%] right-[-10%] opacity-20 scale-150"></div>

            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/20">
                <div className="p-6 flex items-center justify-between max-w-md mx-auto w-full">
                    <button
                        onClick={() => navigate('/menu')}
                        className="flex items-center gap-2 text-secondary font-extrabold hover:text-primary transition-colors active:scale-95"
                    >
                        <ChevronLeft size={22} />
                        Menu
                    </button>
                    <h1 className="text-xl font-black text-secondary tracking-tight">Queue Summary</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </header>

            <main className="flex-1 p-6 max-w-md w-full mx-auto z-10">
                {/* Cart Items */}
                <div className="space-y-4 mb-10">
                    <div className="flex items-center justify-between px-2 mb-2">
                        <h3 className="text-sm font-black text-secondary uppercase tracking-widest opacity-60">Selected Modules</h3>
                        <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{cartItems.length} Items</span>
                    </div>
                    {cartItems.map((item) => (
                        <div key={item.id} className="glass-card p-4 flex items-center gap-5 relative group animate-scale-in">
                            <div className="w-16 h-16 rounded-2xl bg-white/40 flex items-center justify-center text-3xl overflow-hidden shadow-inner border border-white/30 group-hover:scale-105 transition-transform shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    item.icon
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-extrabold text-secondary text-base leading-tight mb-1">{item.name}</h3>
                                <div className="font-mono text-primary font-bold text-sm">₹{item.price}</div>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center bg-white/40 backdrop-blur-sm rounded-2xl p-1.5 border border-white/30 shadow-sm">
                                <button
                                    onClick={() => updateCart(item.id, -1)}
                                    className="w-8 h-8 rounded-xl bg-white/60 shadow-sm flex items-center justify-center text-secondary active:scale-90 transition-transform hover:bg-white"
                                >
                                    {item.qty === 1 ? <Trash2 size={16} className="text-red-500" /> : <Minus size={16} strokeWidth={3} />}
                                </button>
                                <span className="w-8 text-center text-sm font-black">{item.qty}</span>
                                <button
                                    onClick={() => updateCart(item.id, 1)}
                                    className="w-8 h-8 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform hover:brightness-110"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recommendations */}
                {availableAddons.length > 0 && (
                    <div className="mb-10 animate-fade-in px-1">
                        <h3 className="text-sm font-black text-secondary uppercase tracking-[0.2em] mb-4 opacity-60">Boost Performance</h3>
                        <div className="flex overflow-x-auto gap-4 pb-2 -mx-2 px-2 hide-scrollbar snap-x snap-mandatory">
                            {availableAddons.map(addon => (
                                <div
                                    key={addon.id}
                                    className="glass-card p-4 flex-shrink-0 w-52 border-primary/10 group hover:border-primary/40 cursor-pointer snap-center relative shadow-sm"
                                    onClick={() => updateCart(addon.id, 1)}
                                >
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="w-14 h-14 rounded-2xl bg-white/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                                            {addon.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-secondary leading-tight">{addon.name}</h4>
                                            <span className="text-xs text-primary font-mono font-extrabold">+₹{addon.price}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateCart(addon.id, 1); }}
                                        className="w-full text-xs bg-primary text-white font-black py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all mt-1 uppercase tracking-widest"
                                    >
                                        Inject
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Cost Breakdown */}
                <div className="glass-card p-6 mb-10 border border-white/50 shadow-md">
                    <h3 className="text-sm font-black text-secondary mb-5 uppercase tracking-widest opacity-60">Financial Meta</h3>

                    <div className="space-y-4 text-sm font-bold">
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Subtotal</span>
                            <span className="font-mono text-secondary">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Platform Fee</span>
                            <span className="font-mono text-secondary">₹{platformFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                            <span>Cloud Tax (5%)</span>
                            <span className="font-mono text-secondary">₹{cloudTax}</span>
                        </div>

                        <div className="border-t border-white/30 pt-5 mt-5 flex justify-between items-center">
                            <span className="font-black text-secondary text-base uppercase tracking-[0.2em]">Total</span>
                            <span className="font-mono text-2xl text-primary font-black neon-text-primary">
                                ₹{grandTotal}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-black uppercase tracking-widest opacity-60 mb-10">
                    <ShieldCheck size={16} className="text-primary" /> 
                    <span>Encrypted Protocol Active</span>
                </div>
            </main>

            {/* Bottom Sticky Action */}
            <div className="fixed bottom-0 left-0 w-full bg-white/40 backdrop-blur-2xl border-t border-white/20 p-6 pb-safe z-50">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={async () => {
                            const { data: { user } } = await supabase.auth.getUser();
                            if (!user && !guestName) {
                                setCheckoutStep('collect-name');
                            } else {
                                setCheckoutStep('payment-choice');
                            }
                        }}
                        className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-4 relative overflow-hidden group shadow-[0_20px_40px_rgba(255,122,26,0.3)]"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <CreditCard size={24} className="relative z-10" />
                        <span className="relative z-10 uppercase font-black tracking-[0.2em] italic">Commit Transaction</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
