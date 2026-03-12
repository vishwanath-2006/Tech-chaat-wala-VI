import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, Zap } from 'lucide-react';

const ItemDetailModal = ({ item, isOpen, onClose, count, onAdd, onRemove }) => {
    const [isPulsing, setIsPulsing] = useState(false);
    const [popKey, setPopKey] = useState(0);

    // Prevent body scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            setIsPulsing(false);
            setPopKey(0);
        };
    }, [isOpen]);

    if (!isOpen || !item) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleAddWrapper = (e) => {
        e.stopPropagation();
        setIsPulsing(true);
        onAdd(item.id);
        setTimeout(() => setIsPulsing(false), 300);
    };

    const handleIncrement = (e) => {
        e.stopPropagation();
        setPopKey(prev => prev + 1);
        onAdd(item.id);
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        onRemove(item.id);
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
            onClick={handleBackdropClick}
        >
            <div className="surface-card w-full max-w-md bg-surface rounded-[32px] overflow-hidden shadow-2xl animate-bounce-in relative flex flex-col max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center text-textDark border border-white/40 shadow-sm active:scale-95 transition-transform hover:bg-white"
                >
                    <X size={20} />
                </button>

                {/* Hero Image Section */}
                <div className={`relative w-full h-64 bg-slate-100 flex items-center justify-center shrink-0 ${item.isSoldOut ? 'grayscale opacity-80' : ''}`}>
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-6xl blur-[2px] opacity-40">{item.icon}</span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface to-transparent" />

                    {/* Badges */}
                    <div className="absolute bottom-4 left-6 flex gap-2 z-10">
                        {item.isSoldOut ? (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest border border-white/20">
                                🚫 SOLD OUT
                            </span>
                        ) : item.isPopular ? (
                            <span className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(255,122,26,0.5)] uppercase tracking-widest border border-white/20 flex items-center gap-1">
                                🔥 Popular
                            </span>
                        ) : (
                            <span className="bg-secondary text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-widest border border-white/20 flex items-center gap-1">
                                <Zap size={12} className="text-yellow-400" /> Quick
                            </span>
                        )}
                        <span className="bg-white/90 backdrop-blur-sm text-textDark text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                            v{item.version}
                        </span>
                    </div>
                </div>

                {/* Content Section - Scrollable */}
                <div className="p-6 pt-2 overflow-y-auto overflow-x-hidden hide-scrollbar">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-black text-secondary leading-tight pr-4">{item.name}</h2>
                        <span className="text-2xl font-black text-secondary shrink-0"><span className="text-sm">₹</span>{item.price}</span>
                    </div>

                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        {item.description || "Freshly executed and locally sourced."}
                    </p>

                    {/* Nutrition Stats */}
                    <div className="grid grid-cols-4 gap-2 mb-6 text-center">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 flex flex-col items-center justify-center">
                            <span className="text-xs text-textLight font-mono font-medium mb-1 border-b border-slate-200 pb-1 w-full">kCal</span>
                            <span className="font-bold text-secondary text-sm">{item.calories}</span>
                        </div>
                        {item.nutrition && (
                            <>
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 flex flex-col items-center justify-center">
                                    <span className="text-xs text-textLight font-mono font-medium mb-1 border-b border-slate-200 pb-1 w-full">Prot</span>
                                    <span className="font-bold text-secondary text-sm">{item.nutrition.protein}</span>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 flex flex-col items-center justify-center">
                                    <span className="text-xs text-textLight font-mono font-medium mb-1 border-b border-slate-200 pb-1 w-full">Carbs</span>
                                    <span className="font-bold text-secondary text-sm">{item.nutrition.carbs}</span>
                                </div>
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2 flex flex-col items-center justify-center">
                                    <span className="text-xs text-textLight font-mono font-medium mb-1 border-b border-slate-200 pb-1 w-full">Fat</span>
                                    <span className="font-bold text-secondary text-sm">{item.nutrition.fat}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Ingredients */}
                    {item.ingredients && item.ingredients.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-secondary mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary" /> Source Code (Ingredients)
                            </h3>
                            <ul className="text-sm text-textDark space-y-2 grid grid-cols-2">
                                {item.ingredients.map((ing, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="text-slate-300 mt-1">•</span>
                                        <span className="leading-tight">{ing}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Padding so scrolling brings content clearly above the fixed bottom bar */}
                    <div className="h-4" />
                </div>

                {/* Sticky Action Footer */}
                <div className="bg-surface border-t border-slate-100 p-4 shrink-0 flex items-center justify-between shadow-[0_-10px_30px_rgba(27,37,90,0.03)] pb-safe">
                    {item.isSoldOut ? (
                        <button
                            disabled
                            className="w-full bg-slate-200 text-slate-400 font-black text-lg py-4 rounded-[20px] cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Currently Unavailable
                        </button>
                    ) : count > 0 ? (
                        <>
                            <div className="flex items-center bg-slate-100 rounded-[16px] p-1.5 border border-slate-200">
                                <button
                                    onClick={handleDecrement}
                                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-secondary active:scale-95 transition-transform"
                                >
                                    <Minus size={18} strokeWidth={3} />
                                </button>
                                <span key={`qty-${popKey}`} className="w-12 text-center text-lg font-black text-secondary block animate-pop">{count}</span>
                                <button
                                    onClick={handleIncrement}
                                    className="w-10 h-10 rounded-xl bg-primary text-white shadow-[0_2px_5px_rgba(255,122,26,0.5)] flex items-center justify-center active:scale-95 transition-transform"
                                >
                                    <Plus size={18} strokeWidth={3} />
                                </button>
                            </div>

                            <button
                                onClick={onClose}
                                className="flex-1 ml-4 bg-secondary text-white font-bold rounded-[16px] py-3.5 shadow-lg active:scale-[0.98] transition-all text-center"
                            >
                                Done (₹{item.price * count})
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleAddWrapper}
                            className={`w-full bg-primary text-white font-black text-lg py-4 rounded-[20px] shadow-[0_8px_20px_rgba(255,122,26,0.3)] hover:shadow-[0_8px_25px_rgba(255,122,26,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isPulsing ? 'animate-pulse' : ''}`}
                        >
                            Add to List <span className="opacity-80 font-mono text-sm uppercase">₹{item.price}</span>
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ItemDetailModal;
