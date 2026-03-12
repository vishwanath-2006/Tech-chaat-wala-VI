import React from 'react';
import { ShoppingCart } from 'lucide-react';

const GAS_FEE = 15.00;
const TAX_RATE = 0.05; // 5% Cloud Storage Tax

// Import the same data we use in Menu (in a real app this would be in context or a store)
const productData = {
    'f1': { price: 95.00 },
    'c1': { price: 180.00 },
    'c2': { price: 220.00 },
    'c3': { price: 110.00 },
    'b1': { price: 80.00 },
};

function QueueSummary({ cart, onCheckout }) {
    const itemIds = Object.keys(cart);
    const totalItems = itemIds.reduce((sum, id) => sum + cart[id], 0);

    const subtotal = itemIds.reduce((sum, id) => {
        return sum + (productData[id]?.price || 0) * cart[id];
    }, 0);

    const cloudStorageTax = subtotal * TAX_RATE;
    const grandTotal = subtotal + GAS_FEE + cloudStorageTax;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-background-dark/95 backdrop-blur-xl border-t border-primary/20 p-4 pb-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(255,107,0,0.1)]">

                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold flex items-center gap-2">
                        <ShoppingCart size={18} className="text-primary" />
                        Queue Summary
                        <span className="bg-primary/20 text-primary text-xs w-5 h-5 rounded-full flex items-center justify-center ml-1">
                            {totalItems}
                        </span>
                    </h2>
                    <span className="font-mono text-xs text-primary/70">Secure Hash: {(subtotal * 1.337).toString(16).substring(0, 8)}</span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm text-slate-300">
                        <span>Subtotal (Process Load)</span>
                        <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-300">
                        <span>Platform Fee (Gas)</span>
                        <span className="font-mono">₹{GAS_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-300">
                        <span>Cloud Storage Tax (5%)</span>
                        <span className="font-mono">₹{cloudStorageTax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg mt-1">
                        <span className="text-primary">Total Output</span>
                        <span className="font-mono text-primary">₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={onCheckout}
                    className="tech-button-solid w-full py-3 h-14 text-base tracking-wide"
                >
                    COMPILE & CHECKOUT
                </button>
            </div>
        </div>
    );
}

export default QueueSummary;
