import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, ShoppingBag, ChevronLeft, Sparkles, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FoodCard from '../components/menu/FoodCard';
import ItemDetailModal from '../components/menu/ItemDetailModal';
import AssistantPanel from '../components/ui/AssistantPanel';
import ProfileDropdown from '../components/ui/ProfileDropdown';
import { useMenu } from '../context/MenuContext';

const Menu = ({ cart, updateCart, triggerRobot }) => {
    const navigate = useNavigate();
    const { menuData, categories, loading } = useMenu();
    // AI & Micro-interaction States
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [assistantMsg, setAssistantMsg] = useState("Ready to build your smart snack?");
    const [showCombo, setShowCombo] = useState(false);
    const [cartPulse, setCartPulse] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [flyingShadows, setFlyingShadows] = useState([]);
    const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
    const prevCartCount = useRef(cartCount);

    // Watch cart changes to trigger interactions
    useEffect(() => {
        if (cartCount > prevCartCount.current) {
            // Item Added!
            setAssistantMsg("Nice choice! That's a fan favorite.");
            setCartPulse(true);
            setShowCombo(true);

            // Trigger flying shadow
            const shadowId = Date.now();
            setFlyingShadows(prev => [...prev, shadowId]);
            setTimeout(() => {
                setFlyingShadows(prev => prev.filter(id => id !== shadowId));
            }, 1000);

            setTimeout(() => setCartPulse(false), 600);
            setTimeout(() => setShowCombo(false), 4000); // Hide combo toast after 4s
        } else if (cartCount === 0 && !selectedItem) {
            setAssistantMsg("Ready to build your smart snack?");
        }
        prevCartCount.current = cartCount;
    }, [cartCount, selectedItem]);

    // Assistant message override for detailed view
    useEffect(() => {
        if (selectedItem) {
            setAssistantMsg("Great choice! This one is popular.");
        } else if (cartCount === 0) {
            setAssistantMsg("Ready to build your smart snack?");
        }
    }, [selectedItem, cartCount]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold animate-pulse">Syncing Menu Data...</p>
            </div>
        );
    }

    const filteredData = menuData.filter(item => {
        const matchesCategory = activeTab === 'All' || item.category === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
        const item = menuData.find(i => i.id === id);
        return total + (item ? item.price * qty : 0);
    }, 0);

    // Recommended items (grab top 3 popular)
    const recommendedItems = menuData.filter(i => i.isPopular && !cart[i.id]).slice(0, 3);

    return (
        <div className="min-h-screen bg-background pb-28">
            {/* Sticky Header */}
            <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-white/20 shadow-sm pt-safe">
                <div className="p-4 flex items-center justify-between gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-secondary active:scale-95 transition-transform"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search database..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 rounded-full py-2.5 pl-10 pr-4 text-sm font-medium text-secondary placeholder:text-slate-400:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 border border-slate-200 transition-colors"
                        />
                        <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
                    </div>

                    {/* Actions Group */}
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-secondary active:scale-95 border border-slate-200">
                            <SlidersHorizontal size={18} />
                        </button>
                        <ProfileDropdown />
                    </div>
                </div>

                {/* Categories Tab Bar */}
                <div className="bg-surface/90 backdrop-blur-md">
                    <div className="flex flex-nowrap items-center overflow-x-auto hide-scrollbar px-4 py-4 gap-3 touch-pan-x select-none">
                        {categories.filter(c => c.isVisible).map(category => (
                            <button
                                key={category.id}
                                onClick={() => setActiveTab(category.name)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all flex-shrink-0 active:scale-95 ${activeTab === category.name
                                    ? 'bg-secondary text-white shadow-lg border border-secondary/50 transform scale-105'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                        {/* Shadow Gradient to indicate scroll */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface/80 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </header>

            {/* Menu Grid Content */}
            <main className="p-4 relative">

                {/* Smart Food Recommendations */}
                {recommendedItems.length > 0 && activeTab === 'All' && (
                    <div className="mb-8 animate-fade-in">
                        <h2 className="text-sm font-bold flex items-center gap-2 mb-3 text-secondary">
                            <Sparkles size={16} className="text-primary" /> Recommended for You
                        </h2>
                        <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x hide-scrollbar">
                            {recommendedItems.map(item => (
                                <div key={`rec-${item.id}`} className="snap-center shrink-0 w-[240px]">
                                    <div className="surface-card flex items-center p-3 gap-3 border-2 border-primary/20 hover:border-primary/50 cursor-pointer shadow-[0_0_15px_rgba(255,122,26,0.1)] card-lift" onClick={() => updateCart(item.id, 1)}>
                                        <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden shrink-0 shadow-sm flex items-center justify-center text-3xl">
                                            {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" /> : item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-xs font-bold leading-tight mb-1">{item.name}</h4>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-mono text-primary font-bold">₹{item.price}</span>
                                                <span className="text-textLight bg-slate-100 px-1.5 rounded">{item.calories} kC</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {filteredData.map(item => (
                        <FoodCard
                            key={item.id}
                            item={item}
                            count={cart[item.id] || 0}
                            onAdd={(id) => updateCart(id, 1)}
                            onRemove={(id) => updateCart(id, -1)}
                            onClick={() => setSelectedItem(item)}
                            triggerRobot={triggerRobot}
                        />
                    ))}
                </div>
                {filteredData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-textLight">
                        <Search size={40} className="mb-4 opacity-20" />
                        <p className="font-mono text-sm">NO_RESULTS_FOUND</p>
                    </div>
                )}
            </main>

            {/* Smart Combo Suggestions Overlay */}
            {showCombo && (
                <div className="fixed top-24 inset-x-4 max-w-sm mx-auto z-[100] animate-bounce-in">
                    <div className="surface-card bg-surface shadow-2xl p-4 border-2 border-secondary relative overflow-hidden">
                        <p className="text-xs font-black uppercase text-secondary tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles size={14} className="text-primary animate-pulse" /> Perfect Pairings
                        </p>
                        <div 
                            className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 cursor-pointer hover:border-primary/50 transition-colors" 
                            onClick={() => { updateCart('lb-2', 1); setShowCombo(false); }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl drop-shadow-sm">☕</span>
                                <div>
                                    <p className="text-sm font-black text-secondary leading-tight">Nitro Coffee</p>
                                    <p className="text-[10px] text-primary font-mono font-black">+₹149</p>
                                </div>
                            </div>
                            <button className="bg-primary hover:bg-primaryHover text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-sm active:scale-95 transition-all">ADD</button>
                        </div>
                        <button 
                            onClick={() => setShowCombo(false)}
                            className="absolute top-2 right-2 text-slate-300 hover:text-slate-500"
                        >
                            <XCircle size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* AI Assistant Hook */}
            <AssistantPanel message={assistantMsg} fixed={true} position="bottom-left" />

            {/* Floating Cart Intelligence */}
            {cartCount > 0 && (
                <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50 transition-transform duration-300`}>
                    <button
                        onClick={() => navigate('/checkout')}
                        className={`btn-primary w-full p-4 flex flex-col items-stretch gap-1 ${cartPulse ? 'animate-cart-pulse' : ''}`}
                    >
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <ShoppingBag size={24} />
                                    <span className="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                                        {cartCount}
                                    </span>
                                </div>
                                <span className="font-mono font-bold text-lg">₹{cartTotal}</span>
                            </div>
                            <span className="flex items-center gap-1 font-bold">
                                View Queue <ChevronLeft size={18} className="rotate-180" />
                            </span>
                        </div>
                        <div className="text-[10px] text-white/80 font-mono tracking-wide text-left italic">
                            {cartCount} items ready for checkout.
                        </div>
                    </button>
                </div>
            )}

            {/* Item Detail Modal */}
            <ItemDetailModal
                item={selectedItem}
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                count={selectedItem ? (cart[selectedItem.id] || 0) : 0}
                onAdd={(id) => updateCart(id, 1)}
                onRemove={(id) => updateCart(id, -1)}
            />

            {/* Flying Shadows Layer */}
            {flyingShadows.map(id => (
                <div key={id} className="shadow-flyer" />
            ))}
        </div>
    );
};

export default Menu;
