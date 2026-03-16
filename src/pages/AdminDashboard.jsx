import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { useOrders } from '../context/OrderContext';
import { LogOut, ArrowLeft, ShieldAlert, Edit3, CheckCircle2, XCircle, ChefHat, PackageCheck, Play, BellRing, Clock, History, GripVertical, Plus, Search, Eye, EyeOff, Trash2 } from 'lucide-react';

const playAlertSound = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) { }
};

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { menuData, toggleSoldOut, updatePrice, updateItem, addItem, reorderMenu, categories, addCategory, updateCategory, deleteCategory, reorderCategories, toggleCategoryVisibility } = useMenu();
    const { orders: allOrders, updateOrderStatus, updatePaymentStatus, updateOrderPrepTime, deleteOrder, clearHistory } = useOrders();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All'); // For Menu filtering
    const [viewMode, setViewMode] = useState('orders'); // 'menu' | 'orders' | 'history' | 'settings'
    const [historyHiddenBefore, setHistoryHiddenBefore] = useState(() => {
        return Number(localStorage.getItem('admin_history_hidden_before')) || 0;
    });
    const [audioEnabled, setAudioEnabled] = useState(() => {
        const saved = localStorage.getItem('admin_audio_enabled');
        return saved === null ? true : saved === 'true';
    });
    const [shopOpen, setShopOpen] = useState(() => {
        const saved = localStorage.getItem('admin_shop_open');
        return saved === null ? true : saved === 'true';
    });
    const [priceEdits, setPriceEdits] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    // Drag and Drop
    const [dragIdx, setDragIdx] = useState(null);

    // Deep Edit Modal
    const [editingItem, setEditingItem] = useState(null);

    // Category Management
    const [editingCategory, setEditingCategory] = useState(null);
    const [catDragIdx, setCatDragIdx] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);
    const [fallbackCategory, setFallbackCategory] = useState('Uncategorized');

    // Track new orders for sound alerts
    const [lastOrderCount, setLastOrderCount] = useState(allOrders.length);
    React.useEffect(() => {
        if (allOrders.length > lastOrderCount) {
            const hasNewPending = allOrders.slice(lastOrderCount).some(o => o.status === 'pending');
            if (hasNewPending && user?.role === 'staff' && audioEnabled) {
                playAlertSound();
            }
            setLastOrderCount(allOrders.length);
        }
    }, [allOrders, lastOrderCount, user, audioEnabled]);

    React.useEffect(() => {
        localStorage.setItem('admin_audio_enabled', audioEnabled);
    }, [audioEnabled]);

    React.useEffect(() => {
        localStorage.setItem('admin_shop_open', shopOpen);
    }, [shopOpen]);

    // Secure route check
    if (!user || user.role !== 'staff') {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert size={48} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-black text-secondary mb-2">Access Denied</h1>
                <p className="text-slate-500 mb-6 font-medium">This terminal is restricted to authorized personnel.</p>
                <button onClick={() => navigate('/')} className="btn-primary px-8 py-3">Return to Safety</button>
            </div>
        );
    }

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handlePriceChange = (id, newPrice) => {
        setPriceEdits(prev => ({ ...prev, [id]: newPrice }));
    };

    const handlePriceSave = (id) => {
        if (priceEdits[id]) {
            updatePrice(id, priceEdits[id]);
        }
        // remove from edit state
        setPriceEdits(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    const handleDragStart = (e, index) => {
        if (activeTab !== 'All') return;
        setDragIdx(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        if (activeTab !== 'All' || dragIdx === null || dragIdx === index) {
            setDragIdx(null);
            return;
        }
        const newMenu = [...menuData];
        const [draggedItem] = newMenu.splice(dragIdx, 1);
        newMenu.splice(index, 0, draggedItem);
        reorderMenu(newMenu);
        setDragIdx(null);
    };

    const handleSaveEdit = (e) => {
        e.preventDefault();
        if (editingItem.id === 'new') {
            const newItem = { ...editingItem, id: `item-${Date.now()}` };
            addItem(newItem);
        } else {
            updateItem(editingItem);
        }
        setEditingItem(null);
    };

    const handleCatDragStart = (e, index) => {
        if (categories[index].name === 'All') return;
        setCatDragIdx(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleCatDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleCatDrop = (e, index) => {
        e.preventDefault();
        if (catDragIdx === null || catDragIdx === index || categories[index].name === 'All') {
            setCatDragIdx(null);
            return;
        }
        const newCats = [...categories];
        const [draggedCat] = newCats.splice(catDragIdx, 1);
        newCats.splice(index, 0, draggedCat);
        reorderCategories(newCats);
        setCatDragIdx(null);
    };

    const handleSaveCategory = (e) => {
        e.preventDefault();
        if (editingCategory.id === 'new') {
            const newCat = { ...editingCategory, id: `cat-${Date.now()}` };
            addCategory(newCat);
        } else {
            updateCategory(editingCategory);
        }
        setEditingCategory(null);
    };

    const confirmDeleteCategory = () => {
        deleteCategory(deletingCategory.id, fallbackCategory);
        setDeletingCategory(null);
        if (activeTab === deletingCategory.name) {
            setActiveTab('All');
        }
    };

    const filteredMenu = menuData.filter(item => {
        const matchesTab = activeTab === 'All' ? true : item.category === activeTab;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    // POS Workflow status mapping
    // pending, accepted, preparing, ready, completed, 'awaiting payment'
    const pendingOrders = [...allOrders].filter(o => o.status === 'pending' || o.paymentStatus === 'pending').sort((a, b) => a.timestamp - b.timestamp);
    const activeOrders = [...allOrders].filter(o => ['accepted', 'preparing', 'ready'].includes(o.status) && o.paymentStatus === 'paid').sort((a, b) => a.timestamp - b.timestamp);
    const completedOrders = [...allOrders]
        .filter(o => o.status === 'completed' && o.timestamp > historyHiddenBefore)
        .sort((b, a) => a.timestamp - b.timestamp);

    const formatOrderTime = (timestamp) => {
        const d = new Date(timestamp);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    };

    const handleAdjustTime = (orderId, currentPrepTime, delta) => {
        const newTime = Math.max(1, currentPrepTime + delta);
        updateOrderPrepTime(orderId, newTime);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="bg-secondary text-white sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/')} className="text-slate-300 hover:text-white transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                            <h1 className="text-xl font-black tracking-widest flex items-center gap-2">
                                <ShieldAlert size={18} className="text-primary" /> POS TERMINAL
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-slate-300 hidden sm:block">Logged in as <span className="text-white font-bold">{user.name}</span></span>
                            <button
                                onClick={() => setViewMode('settings')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'settings' ? 'bg-primary text-secondary shadow-lg scale-110' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                                title="Terminal Settings"
                            >
                                <BellRing size={20} className={audioEnabled && viewMode !== 'settings' ? 'animate-pulse text-primary' : ''} />
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-500/20 text-red-100 px-4 py-2 rounded-xl hover:bg-red-500 transition-all font-bold text-sm border border-red-500/30"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-3xl font-black text-secondary">Terminal Operations</h2>
                        <p className="text-slate-500 font-medium">Real-time control over kiosk modules.</p>
                    </div>

                    <nav className="flex space-x-2">
                        <button
                            onClick={() => setViewMode('orders')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${viewMode === 'orders' ? 'bg-secondary text-white shadow-xl translate-y-[-2px]' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            <ChefHat size={16} /> Live Orders
                            {(activeOrders.length + pendingOrders.length) > 0 && (
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${viewMode === 'orders' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                                    {activeOrders.length + pendingOrders.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setViewMode('history')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${viewMode === 'history' ? 'bg-secondary text-white shadow-xl translate-y-[-2px]' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            <History size={16} /> History
                        </button>
                        <button
                            onClick={() => setViewMode('menu')}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${viewMode === 'menu' ? 'bg-secondary text-white shadow-xl translate-y-[-2px]' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            <Edit3 size={16} /> Menu Setup
                        </button>
                    </nav>
                </div>

                {viewMode === 'menu' ? (
                    <>
                        {/* Search Bar */}
                        <div className="mb-6">
                            <div className="relative max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 sm:text-sm font-medium transition-colors shadow-sm"
                                    placeholder="Search items to edit..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Categories Tab Bar & Add Button */}
                        {/* Categories Tab Bar & Add Button */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
                            <div className="flex overflow-x-auto hide-scrollbar gap-2 w-full sm:w-auto">
                                {categories.map((category, index) => (
                                    <div
                                        key={category.id}
                                        className={`flex items-stretch rounded-full transition-all ${catDragIdx === index ? 'opacity-50' : ''}`}
                                        draggable={category.name !== 'All'}
                                        onDragStart={(e) => handleCatDragStart(e, index)}
                                        onDragOver={(e) => handleCatDragOver(e, index)}
                                        onDrop={(e) => handleCatDrop(e, index)}
                                    >
                                        {(activeTab === 'All' && category.name !== 'All') && (
                                            <div className="text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500 pl-2 pr-1 py-2 flex items-center bg-slate-50 border border-slate-200 border-r-0 rounded-l-full" title="Drag to reorder category">
                                                <GripVertical size={14} />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setActiveTab(category.name)}
                                            className={`whitespace-nowrap px-5 py-2 text-sm font-bold transition-all flex items-center gap-2 ${activeTab === category.name
                                                ? 'bg-secondary text-white shadow-md border-secondary/50'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                                } ${activeTab === 'All' && category.name !== 'All' ? 'rounded-none border-l-0' : category.name !== 'All' ? 'rounded-l-full border-r-0' : 'rounded-full'} ${!category.isVisible && category.name !== 'All' ? 'opacity-40 grayscale-[0.5] italic' : ''}`}
                                        >
                                            {category.name}
                                            {!category.isVisible && category.name !== 'All' && <EyeOff size={12} className="opacity-50" />}
                                        </button>
                                        {category.name !== 'All' && (
                                            <div className={`flex items-center px-1 border py-1 rounded-r-full transition-all ${activeTab === category.name ? 'border-secondary/50 bg-secondary' : 'bg-white border-slate-200 border-l-0 border-r border-t border-b hover:bg-slate-50'} ${!category.isVisible ? 'opacity-60' : ''}`}>
                                                <button onClick={() => toggleCategoryVisibility(category.id)} className={`p-1.5 rounded-full transition-colors ${activeTab === category.name ? (category.isVisible ? 'text-green-300 hover:text-green-400' : 'text-slate-400 hover:text-slate-300') : (category.isVisible ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50')}`} title={category.isVisible ? 'Visible' : 'Hidden'}>
                                                    {category.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                                                </button>
                                                <button onClick={() => setEditingCategory(category)} className={`p-1.5 rounded-full transition-colors ${activeTab === category.name ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-primary hover:bg-slate-50'}`} title="Edit Category">
                                                    <Edit3 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto hide-scrollbar">
                                <button
                                    onClick={() => setEditingCategory({ id: 'new', name: '', isVisible: true, order: categories.length })}
                                    className="bg-slate-800 text-white hover:bg-slate-900 py-2 px-4 rounded-xl shadow-sm text-sm whitespace-nowrap flex items-center gap-2 font-bold transition-all"
                                >
                                    <Plus size={16} /> Add New Menu
                                </button>
                                <button
                                    onClick={() => setEditingItem({ id: 'new', category: categories.length > 1 ? categories[1].name : 'Uncategorized', name: '', price: 0, calories: 0, prep_time: 3, description: '', ingredients: [], image: '', icon: '🍽️', is_sold_out: false, is_popular: false })}
                                    className="btn-primary py-2 px-4 shadow-sm text-sm whitespace-nowrap flex items-center gap-2"
                                >
                                    <Plus size={16} /> Add New Item
                                </button>
                            </div>
                        </div>

                        {/* Menu List */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <ul className="divide-y divide-slate-100">
                                {filteredMenu.map((item, index) => (
                                    <li
                                        key={item.id}
                                        draggable={activeTab === 'All'}
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        className={`p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${item.is_sold_out ? 'bg-red-50/50' : 'hover:bg-slate-50'} ${dragIdx === index ? 'opacity-50' : ''}`}
                                    >

                                        <div className="flex items-center gap-4 flex-1">
                                            {activeTab === 'All' && (
                                                <div className="text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500 py-2 -ml-2" title="Drag to reorder">
                                                    <GripVertical size={20} />
                                                </div>
                                            )}
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border flex-shrink-0 ${item.is_sold_out ? 'bg-red-100 border-red-200 grayscale' : 'bg-slate-100 border-slate-200'}`}>
                                                {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : item.icon}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold text-lg leading-tight ${item.is_sold_out ? 'text-red-900 line-through opacity-70' : 'text-secondary'}`}>
                                                    {item.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider">{item.id}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0 justify-between sm:justify-end">
                                            {/* Price Edit Control */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-400 font-mono font-bold">₹</span>
                                                <input
                                                    type="number"
                                                    className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-secondary font-mono font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-right"
                                                    value={priceEdits[item.id] !== undefined ? priceEdits[item.id] : item.price}
                                                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                />
                                                {priceEdits[item.id] !== undefined && priceEdits[item.id] !== String(item.price) && (
                                                    <button
                                                        onClick={() => handlePriceSave(item.id)}
                                                        className="bg-primary text-white p-1.5 rounded-lg hover:bg-primaryHover transition-colors shadow-sm"
                                                        title="Save Price"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* Availability Toggle */}
                                            <button
                                                onClick={() => toggleSoldOut(item.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all w-36 justify-center ${item.is_sold_out
                                                    ? 'border-red-200 bg-red-100 text-red-700 hover:bg-red-200 hover:border-red-300'
                                                    : 'border-green-200 bg-green-100 text-green-700 hover:bg-green-200 hover:border-green-300'
                                                    }`}
                                            >
                                                {item.is_sold_out ? (
                                                    <><XCircle size={16} /> Sold Out</>
                                                ) : (
                                                    <><CheckCircle2 size={16} /> Available</>
                                                )}
                                            </button>

                                            {/* Deep Edit Control */}
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="bg-slate-100 text-slate-600 p-2.5 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
                                                title="Full Edit"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : viewMode === 'orders' ? (
                    <div className="space-y-8">
                        {/* New Orders Alert Panel */}
                        {pendingOrders.length > 0 && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-sm animate-pulse-subtle">
                                <h3 className="text-xl font-bold text-red-700 flex items-center gap-2 mb-4">
                                    <BellRing className="animate-bounce" /> New Orders Received
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pendingOrders.map(order => (
                                        <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-red-100 relative overflow-hidden transition-transform hover:scale-[1.02]">
                                            <div className={`absolute top-0 left-0 w-1.5 h-full ${order.status === 'Awaiting Payment' ? 'bg-amber-400' : 'bg-red-500'}`}></div>
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-black text-secondary text-lg">#{order.id.slice(0, 8)}</span>
                                                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-mono">
                                                        <Clock size={10} /> {formatOrderTime(order.timestamp)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-mono text-primary font-bold">₹{order.total}</div>
                                                    <div className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded border inline-block mt-1 ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                        {order.paymentMethod} {order.paymentStatus}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-sm text-slate-600 mb-4 font-medium border-t border-slate-50 pt-2">
                                                {order.items.map(i => (
                                                    <div key={i.name} className="flex justify-between">
                                                        <span>{i.name}</span>
                                                        <span className="font-bold">x{i.qty}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                {order.paymentStatus === 'pending' ? (
                                                    <button
                                                        onClick={() => updatePaymentStatus(order.id, 'paid')}
                                                        className="col-span-2 bg-amber-500 text-white font-black py-2.5 rounded-lg hover:bg-amber-600 active:scale-95 transition-all text-xs uppercase"
                                                    >
                                                        Confirm Payment
                                                    </button>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'accepted')}
                                                            className="bg-indigo-600 text-white font-black py-2.5 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all text-xs uppercase"
                                                        >
                                                            Accept Order
                                                        </button>
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                            className="bg-primary text-white font-black py-2.5 rounded-lg shadow-sm hover:bg-primary/90 active:scale-95 transition-all text-xs uppercase"
                                                        >
                                                            Start Cooking
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Kitchen Dashboard */}
                        <div>
                            <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                                <ChefHat /> Kitchen Queue
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeOrders.length === 0 ? (
                                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                        <p className="text-textLight">The kitchen queue is currently empty.</p>
                                    </div>
                                ) : (
                                    activeOrders.map(order => (
                                        <div key={order.id} className="surface-card rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col h-full relative overflow-hidden group">
                                            {order.status === 'ready' && <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>}
                                            {order.status === 'preparing' && <div className="absolute top-0 left-0 w-full h-1.5 bg-primary animate-pulse"></div>}
                                            {order.status === 'accepted' && <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500"></div>}

                                            <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
                                                <div>
                                                    <h3 className="text-lg font-black text-secondary uppercase tracking-widest">{order.id.slice(0, 8)}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] text-textLight font-mono">Recv: {formatOrderTime(order.timestamp)}</span>
                                                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{order.paymentMethod}</span>
                                                    </div>
                                                </div>
                                                <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border
                                                    ${order.status === 'accepted' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : ''}
                                                    ${order.status === 'preparing' ? 'bg-primary/5 text-primary border-primary/10' : ''}
                                                    ${order.status === 'ready' ? 'bg-green-50 text-green-700 border-green-100' : ''}
                                                `}>
                                                    {order.status}
                                                </div>
                                            </div>

                                            <div className="flex-1 mb-6">
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                                                    <span>Order Assembly</span>
                                                    <span>₹{order.total}</span>
                                                </div>
                                                <ul className="space-y-2">
                                                    {order.items.map((item, idx) => (
                                                        <li key={idx} className="flex justify-between text-sm items-center">
                                                            <span className="text-secondary font-bold">
                                                                <span className="text-primary/60 font-black mr-2">x{item.qty}</span>
                                                                {item.name}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Prep Time Modification */}
                                            {order.status !== 'ready' && (
                                                <div className="mb-4 bg-slate-50/50 rounded-xl p-3 flex justify-between items-center border border-slate-100/50 group-hover:bg-slate-50 transition-colors">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12} /> Cycle Time</span>
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => handleAdjustTime(order.id, order.prepTime, -1)} className="w-6 h-6 rounded-lg bg-white shadow-sm hover:shadow-md border border-slate-200 flex items-center justify-center text-slate-600 font-black active:scale-90 transition-all">-</button>
                                                        <span className="text-sm font-mono font-black w-8 text-center text-secondary">{order.prepTime}m</span>
                                                        <button onClick={() => handleAdjustTime(order.id, order.prepTime, 1)} className="w-6 h-6 rounded-lg bg-white shadow-sm hover:shadow-md border border-slate-200 flex items-center justify-center text-slate-600 font-black active:scale-90 transition-all">+</button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 italic font-black uppercase tracking-widest">
                                                {order.status === 'accepted' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                        className="col-span-2 btn-primary py-3.5 text-xs flex justify-center gap-2 items-center italic"
                                                    >
                                                        <Play size={16} fill="currentColor" /> Initiate Cooking
                                                    </button>
                                                )}

                                                {order.status === 'preparing' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'ready')}
                                                        className="col-span-2 bg-green-500 text-white py-3.5 rounded-xl shadow-[0_4px_12px_rgba(34,197,94,0.4)] hover:bg-green-600 active:scale-95 transition-all text-xs flex justify-center gap-2 items-center italic"
                                                    >
                                                        <PackageCheck size={18} /> Seal & Ready
                                                    </button>
                                                )}

                                                {order.status === 'ready' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'completed')}
                                                        className="col-span-2 bg-slate-900 text-white py-3.5 rounded-xl shadow-lg hover:bg-black active:scale-95 transition-all text-xs flex justify-center gap-2 items-center italic"
                                                    >
                                                        <CheckCircle2 size={18} /> Confirm Handover
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                ) : viewMode === 'history' ? (
                    <HistoryTab
                        orders={completedOrders}
                    />
                ) : viewMode === 'settings' ? (
                    <div className="space-y-6">
                        <div className="surface-card rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
                            <div className="p-10 border-b border-slate-100">
                                <h2 className="text-3xl font-black text-secondary">SYSTEM SETTINGS</h2>
                                <p className="text-slate-500 font-medium">Configure terminal protocols and data lifecycle.</p>
                            </div>

                            <div className="p-10 space-y-8">
                                {/* Audio Toggle */}
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${audioEnabled ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'}`}>
                                            <BellRing size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-secondary uppercase tracking-tight">Audio Notifications</h3>
                                            <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Play sound when a new order arrives.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setAudioEnabled(!audioEnabled)}
                                        className={`w-14 h-8 rounded-full relative transition-all ${audioEnabled ? 'bg-primary' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${audioEnabled ? 'left-7' : 'left-1 shadow-sm'}`} />
                                    </button>
                                </div>

                                {/* Shop Status Toggle */}
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${shopOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {shopOpen ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-secondary uppercase tracking-tight">Business Status</h3>
                                            <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Current shop accessibility for customers.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShopOpen(!shopOpen)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all tracking-widest border-2"
                                        style={{
                                            borderColor: shopOpen ? '#22c55e' : '#ef4444',
                                            color: shopOpen ? '#22c55e' : '#ef4444',
                                            backgroundColor: shopOpen ? '#f0fdf4' : '#fef2f2'
                                        }}
                                    >
                                        {shopOpen ? 'OPEN' : 'CLOSED'}
                                    </button>
                                </div>

                                {/* Purge Action */}
                                <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 relative overflow-hidden group">
                                    <div className="flex items-start gap-4 mb-6 relative z-10">
                                        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm text-red-500 flex items-center justify-center shrink-0">
                                            <Trash2 size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-red-900 leading-tight">Purge Active Transaction Logs</h4>
                                            <p className="text-red-700/70 text-sm font-medium mt-1">
                                                This will hide current transaction records from the staff view.
                                                <span className="font-bold"> Data remains archived </span> in the backend storage.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const timestamp = Date.now();
                                            setHistoryHiddenBefore(timestamp);
                                            localStorage.setItem('admin_history_hidden_before', timestamp.toString());
                                            setViewMode('history');
                                        }}
                                        className="bg-red-600 text-white font-black px-6 py-3 rounded-xl hover:bg-red-700 active:scale-95 transition-all text-sm uppercase tracking-widest whitespace-nowrap"
                                    >
                                        Execute Purge
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden px-4 py-8 text-center text-slate-500 font-medium">
                        Menu management module active. Use the categories above to sort items.
                    </div>
                )}
            </main>

            {/* Deep Edit Modal */}
            {editingItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setEditingItem(null)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-20">
                            <h2 className="text-2xl font-black text-secondary">{editingItem.id === 'new' ? 'Add New Menu Item' : 'Edit Menu Item'}</h2>
                            <button onClick={() => setEditingItem(null)} className="w-10 h-10 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 flex items-center justify-center">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveEdit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Item Name</label>
                                    <input required type="text" value={editingItem.name} onChange={e => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-secondary font-bold focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
                                    <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-medium text-secondary focus:border-primary outline-none">
                                        {categories.filter(c => c.name !== 'All').map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                        <option value="Uncategorized">Uncategorized</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Price (₹)</label>
                                        <input required type="number" value={editingItem.price} onChange={e => setEditingItem({ ...editingItem, price: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-secondary font-mono font-bold focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Prep Time (m)</label>
                                        <input required type="number" value={editingItem.prep_time} onChange={e => setEditingItem({ ...editingItem, prep_time: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-secondary font-mono font-bold focus:border-primary outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Calories</label>
                                        <input type="number" value={editingItem.calories} onChange={e => setEditingItem({ ...editingItem, calories: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-secondary font-mono font-bold focus:border-primary outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Icon Emoji</label>
                                        <input type="text" value={editingItem.icon} onChange={e => setEditingItem({ ...editingItem, icon: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-2xl text-center focus:border-primary outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Image URL</label>
                                    <input type="text" value={editingItem.image || ''} placeholder="/images/fw1_salad.png" onChange={e => setEditingItem({ ...editingItem, image: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 font-mono text-sm focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Description</label>
                                    <textarea rows="3" value={editingItem.description} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 text-sm focus:border-primary outline-none resize-none"></textarea>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Ingredients (comma separated)</label>
                                    <textarea rows="2" value={Array.isArray(editingItem.ingredients) ? editingItem.ingredients.join(', ') : ''} onChange={e => setEditingItem({ ...editingItem, ingredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 text-sm focus:border-primary outline-none resize-none"></textarea>
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 mt-4 flex gap-4 pt-6 border-t border-slate-100">
                                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 btn-outline py-3 text-sm">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary py-3 text-sm">Save Configuration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setEditingCategory(null)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 animate-scale-in overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-lg font-black text-secondary">{editingCategory.id === 'new' ? 'New Menu Category' : 'Edit Category'}</h2>
                            <button onClick={() => setEditingCategory(null)} className="w-8 h-8 text-slate-400 hover:text-slate-600 flex items-center justify-center">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveCategory} className="p-5 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category Name</label>
                                <input required type="text" value={editingCategory.name} onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-secondary font-bold focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <p className="font-bold text-secondary text-sm">Customer Visibility</p>
                                    <p className="text-xs text-slate-500">Show this category on the kiosk menu</p>
                                </div>
                                <button type="button" onClick={() => setEditingCategory({ ...editingCategory, isVisible: !editingCategory.isVisible })} className={`w-12 h-6 rounded-full relative transition-colors ${editingCategory.isVisible ? 'bg-primary' : 'bg-slate-300'}`}>
                                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${editingCategory.isVisible ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                            <div className="pt-4 flex gap-2">
                                {editingCategory.id !== 'new' && (
                                    <button
                                        type="button"
                                        onClick={() => { setDeletingCategory(editingCategory); setEditingCategory(null); }}
                                        className="p-3 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                        title="Delete Category"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                )}
                                <button type="submit" className="flex-1 btn-primary py-3">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Delete Modal */}
            {deletingCategory && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-red-900/40 backdrop-blur-sm" onClick={() => setDeletingCategory(null)}></div>
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 animate-scale-in p-6">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <ShieldAlert size={28} />
                            <h2 className="text-xl font-black">Delete Category?</h2>
                        </div>
                        <p className="text-sm text-slate-600 mb-6">You are about to delete the <span className="font-bold text-secondary">{deletingCategory.name}</span> category. Items inside this category need to be reassigned.</p>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Reassign items to:</label>
                            <select value={fallbackCategory} onChange={e => setFallbackCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 font-medium text-secondary focus:border-primary outline-none">
                                {categories.filter(c => c.id !== deletingCategory.id && c.name !== 'All').map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                                <option value="Uncategorized">Uncategorized</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setDeletingCategory(null)} className="flex-1 btn-outline py-3 text-sm">Cancel</button>
                            <button onClick={confirmDeleteCategory} className="flex-1 bg-red-500 text-white font-bold rounded-xl shadow-sm hover:bg-red-600 active:scale-95 transition-all text-sm">Delete & Reassign</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Subcomponents for Cleanliness ---

const HistoryTab = ({ orders }) => {
    // Default to today's date in IST
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        const istDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
        return istDate;
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [sortBy, setSortBy] = useState('latest'); // latest | oldest | high-price | low-price

    // Filter by local IST date
    const filteredOrders = orders.filter(o => {
        const orderDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(o.timestamp));
        return orderDate === selectedDate;
    });

    // Apply Sorting
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortBy === 'latest') return b.timestamp - a.timestamp;
        if (sortBy === 'oldest') return a.timestamp - b.timestamp;
        if (sortBy === 'high-price') return b.total - a.total;
        if (sortBy === 'low-price') return a.total - b.total;
        return 0;
    });

    // Daily Stats
    const dailyCount = filteredOrders.length;
    const dailyRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

    return (
        <div className="space-y-6">
            {/* Stats & Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Daily Payload</p>
                    <h4 className="text-3xl font-black text-secondary">{dailyCount} <span className="text-sm font-medium text-slate-400">Orders</span></h4>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Daily Revenue</p>
                    <h4 className="text-3xl font-black text-primary italic">₹{dailyRevenue.toLocaleString()}</h4>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Protocol Date</label>
                            <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-secondary outline-none focus:border-primary transition-colors text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Sort By</label>
                            <select 
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-secondary outline-none focus:border-primary transition-colors text-xs appearance-none"
                            >
                                <option value="latest">Latest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="high-price">Price: High</option>
                                <option value="low-price">Price: Low</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* History List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary text-white rounded-xl flex items-center justify-center">
                            <History size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-secondary">Transaction Logs</h3>
                            <p className="text-xs text-slate-500 font-medium">Filtered by: {new Date(selectedDate).toDateString()}</p>
                        </div>
                    </div>
                </div>

                {filteredOrders.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-4 border border-slate-100">📂</div>
                        <h4 className="text-xl font-bold text-secondary">No recorded data for this cycle</h4>
                        <p className="text-slate-500 text-sm mt-1">Select a different date or check live orders.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                    <th className="px-6 py-4">ID / Customer</th>
                                    <th className="px-6 py-4">Modules</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Payload</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {sortedOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-black text-secondary uppercase tracking-tighter">#{order.id.slice(0, 8)}</div>
                                            <div className="text-xs font-bold text-slate-400">{order.customerName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-slate-600 line-clamp-1 max-w-[200px]">
                                                {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-mono font-bold text-slate-500">
                                                {new Date(order.timestamp).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-black text-secondary">₹{order.total}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-secondary hover:text-white transition-all shadow-sm"
                                                title="View Technical Specs"
                                            >
                                                <Eye size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Details Modal (Technical Specs View) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-black text-secondary uppercase tracking-tight">Transaction Specs</h2>
                                <p className="text-[10px] font-mono font-bold text-slate-400">UID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 bg-white text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 flex items-center justify-center border border-slate-200 transition-all">
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Identifier</p>
                                    <p className="font-bold text-secondary text-sm">{selectedOrder.customerName}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Execution Method</p>
                                    <p className="font-bold text-secondary text-sm">{selectedOrder.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Module Breakdown</h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-md bg-white/10 text-primary flex items-center justify-center font-black text-[10px]">
                                                    {item.qty}x
                                                </div>
                                                <span className="font-bold text-slate-300 text-sm">{item.name}</span>
                                            </div>
                                            <span className="font-mono font-bold text-slate-500 text-xs">₹{item.price ? item.price * item.qty : '--'}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-5 border-t border-slate-800 flex justify-between items-center">
                                    <span className="text-xs font-black text-slate-500 uppercase italic">Final Payload</span>
                                    <span className="text-2xl font-black text-primary italic">₹{selectedOrder.total}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 pt-0 flex gap-3">
                             <button 
                                onClick={() => setSelectedOrder(null)}
                                className="flex-1 py-4 bg-secondary text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                            >
                                Close Specs View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
