import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, CreditCard, ShieldCheck, Trash2, X } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useOrders } from '../context/OrderContext';

const Checkout = ({ cart, updateCart }) => {
    const navigate = useNavigate();
    const { menuData } = useMenu();
    const { addOrder } = useOrders();

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

    const handleCheckout = () => {
        // Dispatch the order to the queue
        const orderId = addOrder({ items: cartItems, total: grandTotal });

        // Clear customer cart (keep robot reaction happy)
        updateCart('ALL_CLEAR', 0); // we will define a clear function or just re-route

        // Navigate to the processing cooking stages
        navigate('/processing', { state: { orderId } });
    };

    if (cartItems.length === 0) {
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

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-slate-200">
                <div className="p-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/menu')}
                        className="flex items-center gap-1 text-secondary font-bold text-sm select-none active:scale-95 transition-transform"
                    >
                        <ChevronLeft size={20} />
                        Back to Menu
                    </button>
                    <div className="flex items-center gap-4">

                        <h1 className="text-lg font-black text-secondary uppercase tracking-wider hidden sm:block">Queue Summary</h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-4 pb-32 max-w-md w-full mx-auto">
                {/* Cart Items */}
                <div className="space-y-3 mb-8">
                    {cartItems.map((item) => (
                        <div key={item.id} className="surface-card p-3 flex items-center gap-4 relative">
                            {/* Remove Icon */}
                            <button
                                onClick={() => updateCart(item.id, -item.qty)}
                                className="absolute -top-2 -right-2 bg-white shadow-md rounded-full w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-600 border border-slate-100 z-10 hover:scale-110 transition-transform"
                            >
                                <X size={12} strokeWidth={3} />
                            </button>

                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl overflow-hidden shadow-sm border border-slate-200">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                                ) : (
                                    item.icon
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-secondary text-sm leading-tight mb-1">{item.name}</h3>
                                <div className="font-mono text-primary font-bold text-sm">₹{item.price}</div>
                            </div>

                            {/* Quantity Stepper */}
                            <div className="flex items-center bg-slate-100 rounded-[12px] p-1 border border-slate-200">
                                <button
                                    onClick={() => updateCart(item.id, -1)}
                                    className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-secondary active:scale-95"
                                >
                                    {item.qty === 1 ? <Trash2 size={16} strokeWidth={2.5} className="text-red-500" /> : <Minus size={16} strokeWidth={3} />}
                                </button>
                                <span className="w-8 text-center text-sm font-bold block">{item.qty}</span>
                                <button
                                    onClick={() => updateCart(item.id, 1)}
                                    className="w-7 h-7 rounded-lg bg-primary text-white shadow-[0_2px_5px_rgba(255,122,26,0.3)] flex items-center justify-center active:scale-95"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sub-modules (Dynamic Horizontal Add-ons) */}
                {availableAddons.length > 0 && (
                    <div className="mb-8 animate-fade-in">
                        <h3 className="text-xs font-bold text-textLight uppercase tracking-wider mb-3 px-2">Recommendations</h3>
                        <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 snap-x snap-mandatory hide-scrollbar">
                            {availableAddons.map(addon => (
                                <div
                                    key={addon.id}
                                    className="surface-card p-3 flex-shrink-0 w-48 border-dashed border-2 border-primary/20 group hover:border-primary/50 transition-colors cursor-pointer snap-center relative"
                                    onClick={() => updateCart(addon.id, 1)}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-sm">
                                            {addon.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-secondary leading-tight">{addon.name}</h4>
                                            <span className="text-xs text-primary font-mono font-bold">+₹{addon.price}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateCart(addon.id, 1); }}
                                        className="w-full text-xs bg-primary/10 text-primary font-bold py-2 rounded-lg border border-primary/20 hover:bg-primary/20 active:scale-95 transition-all mt-1"
                                    >
                                        ADD
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Return to Menu Additional CTA */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/menu')}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-[16px] border-2 border-secondary text-secondary font-bold hover:bg-secondary/5:bg-primary/10 transition-colors active:scale-95"
                    >
                        <Plus size={18} />
                        Add More Items
                    </button>
                </div>

                {/* Cost Breakdown */}
                <div className="surface-card p-5 mb-8">
                    <h3 className="text-sm font-bold text-secondary mb-4 border-b border-slate-100 pb-2">Transaction Details</h3>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center text-textLight">
                            <span>Subtotal</span>
                            <span className="font-mono font-bold">₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between items-center text-textLight">
                            <span>Platform Fee</span>
                            <span className="font-mono font-bold">₹{platformFee}</span>
                        </div>
                        <div className="flex justify-between items-center text-textLight">
                            <span>Cloud Storage Tax (5%)</span>
                            <span className="font-mono font-bold">₹{cloudTax}</span>
                        </div>

                        <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                            <span className="font-black text-secondary uppercase tracking-wider">Total</span>
                            <span className="font-mono text-xl text-primary font-black neon-text-primary">
                                ₹{grandTotal}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Secure Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-textLight font-mono opacity-60">
                    <ShieldCheck size={14} /> End-to-end Encrypted Order
                </div>
            </main>

            {/* Bottom Sticky Action */}
            <div className="fixed bottom-0 left-0 w-full bg-surface border-t border-slate-200 p-4 pb-safe z-50">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={handleCheckout}
                        className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3"
                    >
                        <CreditCard size={20} className="transition-transform" />
                        <span>Pay & Execute Transaction</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
