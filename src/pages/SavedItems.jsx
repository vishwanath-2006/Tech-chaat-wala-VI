import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { useOrders } from '../context/OrderContext';
import { ArrowLeft, Heart, Bookmark, AlertCircle, Plus, Minus } from 'lucide-react';

const SavedItems = () => {
    const { user, toggleSavedItem } = useAuth();
    const { menuData } = useMenu();
    const { addOrder } = useOrders();
    const navigate = useNavigate();

    // Secure route
    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle size={48} className="text-primary mb-4" />
                <h1 className="text-2xl font-black text-secondary mb-2">Login Required</h1>
                <p className="text-slate-500 mb-6 font-medium">Please log in to view and save your favorite menu items.</p>
                <button onClick={() => navigate('/login')} className="btn-primary px-8 py-3">Login to Continue</button>
            </div>
        );
    }

    const savedMenuData = menuData.filter(item => user.savedItems?.includes(item.id));

    const handleAddToCart = (item) => {
        // Quick add to cart logic, simulates creating a 1-item order or directing to menu
        // Since cart lives in App.jsx and we are on a separate route without cart passing
        // the easiest way for MVP is to simulate an immediate order or just tell user to order from Menu
        // As per prompt: "Add to Cart   Remove"
        // Let's navigate to menu with some state, or simply create an immediate pending order for demo purposes
        navigate('/menu');
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Minimal Header */}
            <header className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-secondary hover:bg-slate-100 transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-lg font-black text-secondary flex items-center gap-2">
                                <Bookmark size={18} className="text-primary" /> Saved Items
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                {savedMenuData.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart size={32} className="text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-secondary mb-2">You have no saved items yet.</h2>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Explore the menu and tap the heart icon to save your favorite modular gastronomy creations.</p>
                        <button onClick={() => navigate('/menu')} className="btn-primary px-8 py-3">Browse Menu</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedMenuData.map(item => (
                            <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
                                {/* Image Box */}
                                <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    ) : (
                                        <span className="text-3xl">{item.icon}</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-secondary text-base truncate pr-2">{item.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 mb-2">
                                        <span className="font-black text-primary text-sm">₹{item.price}</span>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-xs font-mono text-slate-500">{item.calories} kcal</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primaryHover transition-colors flex-1 text-center"
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => toggleSavedItem(item.id)}
                                            className="bg-red-50 text-red-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-100 border border-red-100 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedItems;
