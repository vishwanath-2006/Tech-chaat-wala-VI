import React, { useState } from 'react';
import { Dumbbell, Utensils, Coffee } from 'lucide-react';
import ProductCard from './ProductCard';

const menuData = {
    'fit-ware': [
        { id: 'f1', name: 'Cloud-Compute Corn', desc: 'Server-Side Seasoning', kcal: 180, price: 95.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtjnc0p3tRP43jLGzuA6JRUH2nwJtmbMQRqIUcoroiOUM2orVUAsGE76Z2HfSMiej6yL9r39GsoSlqVY53VHlqfmCdRTbqrAnm2IcBPrgD5D7OlHDf_-IXpaqPW4BSZC5uhKZbZTyEq5BQiylgdSOQazbyuX9S8PGYdE_heAQeH0IuY0LRRko966_il_vA-80s6yhRF_Ao3Q5pxntrCkh9QcBdwP9UQFJMTwksB3shGh_-PvovuJewPM3fG4XNuMpNcKyXtrsInSKH' }
    ],
    'chaats': [
        { id: 'c1', name: 'Protein-Rich Paneer Platter', desc: 'Density Blocks', kcal: 310, price: 180.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvVD2xy1S_ugHVXQHxPu37fjVnxqJCn4Qqm6FtOD3Uu7TOLgbC7KrroNLOn2PrGJ_rbGQ5qYPioyK4dlP2chQ-UIkHOLdCG8-DDx_go7N0SExGfELCVwEbCzQv4SE9z53WDEZZ_J3I5kcfsQAxLpOheuG-fG9dLLJo9wH67iDfzhlJS5jbjvHgSCHGdM_EGO-9K4gFlwrd6KYVSDE6o740aoGUCDWjt4ncIG6tf3mrLyqTytmmT0gdlDq744mLo2HiM6DP0lQqUbkJ' },
        { id: 'c2', name: 'Quinoa Query Bowl', desc: 'Nitro Chutney Plugin', kcal: 220, price: 220.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN16NFKDdnjU-5s1QmKz6A6B7AaCTR9MLFfSjuA5Cb5K0yUSX8TCIqlmsoX_ABBxGWBhL1VHgiDcLkdVUaOoiG5HfW3EnUJiSnwdU9NyaHHv4oAhPqFPltXnJsjUcFmfq3xKtVjfspjqpOWjhMcW5ZcDPEd_lSa0qHalyKHFPNPgN1RrjtwdpunhImEz3sNLD7j-Ky-U2K30fwlC8k0glke0lHP-63tRsYSO2nhzZtJcS9rUsIzjM6lv1QSOivgiqHgAvCNfAmXJnX' },
        { id: 'c3', name: 'Bandwidth Bajji', desc: 'High-Throughput Crispiness', kcal: 320, price: 110.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6aukZmmkeKavxETM3IweaTel0DmfwKBzqH2meUXQBWKmRGcJAUC-5hEW8Oa0SVBFC-WPEB8i1RvdMq2f_cAglD8HEsYUscPhhaHbEYQfcBftHqUrMu1L5rKIogjFA2IOgRQjWcVrQb-HL2iTxLVoUjNCYPEHT2WaIohIUF-iw8cT2Ec0J6B4SKZs8JaecBQtG6JrwTwv-nsX7_gIJqXk1YdpL20_4xsyoJPoBT_9ojI5vfWxascEwzDj0NvgghBZcxzHTUgLmMhNU' }
    ],
    'brews': [
        { id: 'b1', name: 'Byte-Sized Black Coffee', desc: 'Kernel Wake-up Protocol', kcal: 5, price: 80.00, img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6aukZmmkeKavxETM3IweaTel0DmfwKBzqH2meUXQBWKmRGcJAUC-5hEW8Oa0SVBFC-WPEB8i1RvdMq2f_cAglD8HEsYUscPhhaHbEYQfcBftHqUrMu1L5rKIogjFA2IOgRQjWcVrQb-HL2iTxLVoUjNCYPEHT2WaIohIUF-iw8cT2Ec0J6B4SKZs8JaecBQtG6JrwTwv-nsX7_gIJqXk1YdpL20_4xsyoJPoBT_9ojI5vfWxascEwzDj0NvgghBZcxzHTUgLmMhNU' }
    ]
};

function Menu({ cart, updateCart }) {
    const [activeTab, setActiveTab] = useState('fit-ware');

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-primary/20 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <span className="font-mono text-primary font-bold">TCW</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Tech Chaat Wala</h1>
                            <p className="text-xs font-mono text-primary">Cyber-Street Modules</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <span className="font-mono text-xs text-primary">ONLINE</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('fit-ware')}
                        className={`flex-1 min-w-[100px] py-2 px-3 rounded-lg font-mono text-xs transition-colors flex items-center justify-center gap-2 ${activeTab === 'fit-ware' ? 'bg-primary/20 text-primary border border-primary/50' : 'text-slate-400 border border-transparent'}`}
                    >
                        <Dumbbell size={14} /> FIT-WARE
                    </button>
                    <button
                        onClick={() => setActiveTab('chaats')}
                        className={`flex-1 min-w-[100px] py-2 px-3 rounded-lg font-mono text-xs transition-colors flex items-center justify-center gap-2 ${activeTab === 'chaats' ? 'bg-primary/20 text-primary border border-primary/50' : 'text-slate-400 border border-transparent'}`}
                    >
                        <Utensils size={14} /> CHAATS.JS
                    </button>
                    <button
                        onClick={() => setActiveTab('brews')}
                        className={`flex-1 min-w-[100px] py-2 px-3 rounded-lg font-mono text-xs transition-colors flex items-center justify-center gap-2 ${activeTab === 'brews' ? 'bg-primary/20 text-primary border border-primary/50' : 'text-slate-400 border border-transparent'}`}
                    >
                        <Coffee size={14} /> BREW-VAGES
                    </button>
                </div>
            </header>

            {/* Product List */}
            <main className="flex-1 p-4 space-y-4">
                {menuData[activeTab].map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        quantity={cart[product.id] || 0}
                        updateCart={updateCart}
                    />
                ))}
            </main>
        </div>
    );
}

export default Menu;
