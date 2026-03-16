import React, { useState } from 'react';
import { Plus, Minus, Zap, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const FoodCard = ({ item, count, onAdd, onRemove, onClick, triggerRobot }) => {
    const { user, toggleSavedItem } = useAuth();
    const [isPulsing, setIsPulsing] = useState(false);
    const [popKey, setPopKey] = useState(0);
    const [imgError, setImgError] = useState(false);

    const isSaved = user?.savedItems?.includes(item.id);

    const handleToggleSave = (e) => {
        e.stopPropagation();
        if (user) {
            toggleSavedItem(item.id);
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
            onClick={item.is_sold_out ? () => { if (triggerRobot) triggerRobot('sold_out') } : onClick}
            className={`surface-card card-lift overflow-visible flex flex-col group relative mt-8 ${item.is_sold_out ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer'} ${isPulsing ? 'animate-pulse' : ''}`}
        >
            {/* Image Placeholder */}
            <div className="flex items-center justify-center -mt-8 mb-2 relative px-4">
                <div className="w-24 h-24 rounded-full shadow-lg border-4 border-white overflow-hidden relative z-10 bg-slate-100 group-hover:-translate-y-1 group-hover:shadow-xl transition-all duration-300">
                    {item.image && !imgError ? (
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-3xl opacity-50 flex items-center justify-center h-full">{item.icon}</span>
                    )}
                    <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.08)] pointer-events-none rounded-full" />
                </div>

                {/* Gamified Badges */}
                {item.is_sold_out ? (
                    <div className="absolute top-8 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md z-20 uppercase tracking-widest border border-white/20 flex items-center gap-1">
                        SOLD OUT
                    </div>
                ) : item.is_popular ? (
                    <div className="absolute top-8 right-2 bg-primary text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-[0_2px_8px_rgba(255,122,26,0.5)] z-20 uppercase tracking-widest border border-white/20 flex items-center gap-1">
                        🔥 Popular
                    </div>
                ) : (
                    <div className="absolute top-8 right-2 bg-secondary text-white text-[9px] font-bold px-2 py-1 rounded-full shadow-md z-20 uppercase tracking-widest border border-white/20 flex items-center gap-1">
                        <Zap size={10} className="text-yellow-400" /> Quick
                    </div>
                )}

                {/* Save Item Heart */}
                {user && (
                    <button
                        onClick={handleToggleSave}
                        className="absolute top-8 left-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-md z-20 hover:scale-110 active:scale-95 transition-all text-red-500"
                    >
                        <Heart size={16} fill={isSaved ? "currentColor" : "none"} strokeWidth={isSaved ? 0 : 2.5} className={isSaved ? "animate-pop" : ""} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="p-4 pt-1 flex flex-col flex-grow items-center text-center">
                <h3 className="font-bold text-secondary text-sm leading-tight mb-2 group-hover:text-primary transition-colors">{item.name}</h3>

                {/* Tech Metadata */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-[10px] font-mono text-textLight bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {item.calories} kCal
                    </span>
                    <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        v{item.version}
                    </span>
                </div>

                <div className="mt-auto flex items-center justify-between">
                    <div className="font-black text-secondary">
                        <span className="text-sm">₹</span>{item.price}
                    </div>

                    {/* Add / Stepper Logic */}
                    {item.is_sold_out ? (
                        <div className="w-8 h-8 rounded-[12px] bg-slate-200 text-slate-400 flex items-center justify-center border border-slate-300">
                            <Minus size={14} strokeWidth={3} />
                        </div>
                    ) : count > 0 ? (
                        <div className="flex items-center bg-slate-100 rounded-[12px] p-1 border border-slate-200">
                            <button
                                onClick={handleDecrement}
                                className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-secondary active:scale-95"
                            >
                                <Minus size={14} strokeWidth={3} />
                            </button>
                            <span key={`qty-${popKey}`} className="w-6 text-center text-sm font-bold block animate-pop">{count}</span>
                            <button
                                onClick={handleIncrement}
                                className="w-6 h-6 rounded-lg bg-primary text-white shadow-[0_2px_5px_rgba(255,122,26,0.5)] flex items-center justify-center active:scale-95"
                            >
                                <Plus size={14} strokeWidth={3} />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddWrapper}
                            className="w-8 h-8 rounded-[12px] bg-primary text-white flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_rgba(255,122,26,0.6)] transition-all active:scale-95 btn-bounce"
                        >
                            <Plus size={18} strokeWidth={3} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
