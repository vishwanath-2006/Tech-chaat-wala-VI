import React from 'react';
import { Plus, Minus } from 'lucide-react';

function ProductCard({ product, quantity, updateCart }) {
    return (
        <div className="glass-card rounded-2xl p-3 flex gap-4 items-center">
            <div className="w-24 h-24 rounded-xl bg-slate-800 border border-white/5 overflow-hidden flex-shrink-0">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover opacity-90" />
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-1 truncate">{product.name}</h3>
                <p className="font-mono text-[10px] text-slate-400 mb-2 truncate">{product.desc}</p>
                <div className="inline-block px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                    <span className="font-mono text-[10px] text-primary">{product.kcal} KCAL</span>
                </div>
            </div>

            <div className="flex flex-col items-end justify-between h-24">
                <span className="font-mono font-bold text-primary">₹{product.price.toFixed(2)}</span>

                {quantity > 0 ? (
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1 border border-white/10">
                        <button
                            onClick={() => updateCart(product.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md bg-white/10 text-white active:scale-90 transition-transform"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="font-mono font-bold text-sm w-4 text-center">{quantity}</span>
                        <button
                            onClick={() => updateCart(product.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-md bg-primary/20 text-primary active:scale-90 transition-transform"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => updateCart(product.id, 1)}
                        className="tech-button w-10 h-10"
                    >
                        <Plus size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}

export default ProductCard;
