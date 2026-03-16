import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { ArrowLeft, CheckCircle2, Package, Clock, X, Info, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import BillReceipt from '../components/ui/BillReceipt';

const Orders = () => {
    const { user } = useAuth();
    const { orders: allOrders, loading } = useOrders();
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Filter orders for the current user
    const userOrders = allOrders
        .filter(o => o.userId === user?.id && o.status === 'completed')
        .sort((a, b) => b.timestamp - a.timestamp);

    // Check auth
    if (!user) {
        navigate('/login');
        return null;
    }

    const downloadBill = async () => {
        if (billRef.current && selectedOrder) {
            try {
                const canvas = await html2canvas(billRef.current, { scale: 2, useCORS: true, logging: false });
                canvas.toBlob((blob) => {
                    if (!blob) return;
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.download = `TCW_Bill_${selectedOrder.id.slice(0, 8)}.png`;
                    document.body.appendChild(link);
                    link.click();
                    setTimeout(() => {
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(link);
                    }, 100);
                }, 'image/png');
            } catch (err) {
                console.error("Bill gen failed:", err);
            }
        }
    };

    const formatLongDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-lg"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative">
            {/* Header */}
            <div className="flex items-center gap-6 mb-12">
                <button
                    onClick={() => navigate('/menu')}
                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm hover:shadow-md transition-all border border-slate-200 shrink-0"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-secondary leading-tight">Interaction History</h1>
                    <p className="text-slate-500 font-medium">Past data packets</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
                {userOrders.length === 0 ? (
                    <div className="surface-card p-12 rounded-[32px] text-center border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">📭</div>
                        <h2 className="text-xl font-bold text-secondary mb-2">No Records Found</h2>
                        <p className="text-slate-500 mb-6">Your interaction history is currently empty. Initialize a transaction to see logs here.</p>
                        <button onClick={() => navigate('/menu')} className="btn-primary px-8 py-3">Start Browsing</button>
                    </div>
                ) : (
                    userOrders.map((order) => (
                        <div 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="surface-card p-6 md:p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl relative overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-2xl transition-all group"
                        >

                            {/* Decorative background element */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />

                            {/* Order Header / Meta */}
                            <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 mb-5 relative z-10">
                                <div>
                                    <h3 className="text-lg font-black text-secondary flex items-center gap-2">
                                        <Package size={20} className="text-primary" /> #{order.id.slice(0, 8)}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                                        <Clock size={14} /> {formatLongDate(order.timestamp)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1 border border-green-200 w-fit ml-auto md:mx-0 mb-1">
                                        <CheckCircle2 size={12} /> {order.status}
                                    </span>
                                    <p className="font-black text-secondary text-xl pr-1">₹{order.total}</p>
                                </div>
                            </div>

                            {/* Order Items Summary */}
                            <div className="space-y-3 relative z-10">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Info size={14} /> Items Summary
                                </p>
                                <div className="text-sm text-secondary font-bold line-clamp-1">
                                    {order.items.map(item => `${item.qty}x ${item.name}`).join(', ')}
                                </div>
                            </div>

                            {/* View Details Button */}
                            <div className="mt-6 flex justify-center">
                                <span className="text-xs font-black text-primary uppercase tracking-[0.2em] group-hover:translate-y-[-2px] transition-transform">
                                    Click to view technical specs
                                </span>
                            </div>

                        </div>
                    ))
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-scale-in">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-secondary">Transaction Specs</h2>
                                <p className="text-sm font-medium text-slate-500">ID: {selectedOrder.id}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 bg-white text-slate-500 rounded-full hover:bg-slate-100 flex items-center justify-center border border-slate-200 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Timestamp</p>
                                    <p className="font-bold text-secondary text-sm">{new Date(selectedOrder.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Method</p>
                                    <p className="font-bold text-secondary text-sm">{selectedOrder.paymentMethod}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-secondary uppercase tracking-widest opacity-60">Module Breakdown</h3>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                                                    {item.qty}x
                                                </div>
                                                <span className="font-bold text-secondary">{item.name}</span>
                                            </div>
                                            <span className="font-black text-secondary opacity-60">₹{item.price ? item.price * item.qty : '--'}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex justify-between items-center">
                                <span className="text-lg font-black text-secondary italic">Final Payload</span>
                                <span className="text-3xl font-black text-primary italic">₹{selectedOrder.total}</span>
                            </div>
                        </div>
                        <div className="p-8 pt-0 flex gap-4">
                            <button 
                                onClick={downloadBill}
                                className="w-1/3 py-4 rounded-2xl bg-slate-100 text-slate-500 hover:text-secondary font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300"
                            >
                                <Download size={18} />
                                <span className="text-[10px]">Get Bill</span>
                            </button>
                            <button 
                                onClick={() => navigate('/menu')}
                                className="w-2/3 py-4 rounded-2xl bg-secondary text-white font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 text-xs flex justify-center items-center"
                            >
                                Recompile Order
                            </button>
                        </div>
                        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -100 }}>
                            <BillReceipt ref={billRef} order={selectedOrder} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
