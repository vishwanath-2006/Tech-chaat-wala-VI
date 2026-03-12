import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, CheckCircle2, Package, Clock } from 'lucide-react';

// Mock static data for orders
const MOCK_ORDERS = [
    {
        id: 'ORD-1094',
        date: 'Today, 14:32',
        status: 'Completed',
        total: 298,
        items: [
            { name: 'Sprout Circuit Salad', qty: 1, price: 149 },
            { name: 'Nitro Processed Coffee', qty: 1, price: 149 }
        ]
    },
    {
        id: 'ORD-0962',
        date: 'Yesterday, 19:15',
        status: 'Completed',
        total: 139,
        items: [
            { name: 'DDoS Dahi Bhalla', qty: 1, price: 139 }
        ]
    },
    {
        id: 'ORD-0511',
        date: 'Mar 08, 12:00',
        status: 'Completed',
        total: 418,
        items: [
            { name: 'Async Avocado Wrap', qty: 1, price: 249 },
            { name: 'Cloud Matcha Latte', qty: 1, price: 169 }
        ]
    }
];

const Orders = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Check auth
    if (!user) {
        navigate('/login');
        return null;
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
                {MOCK_ORDERS.map((order) => (
                    <div key={order.id} className="surface-card p-6 md:p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl relative overflow-hidden">

                        {/* Decorative background element */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl" />

                        {/* Order Header / Meta */}
                        <div className="flex flex-wrap md:flex-nowrap justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5 mb-5 relative z-10">
                            <div>
                                <h3 className="text-lg font-black text-secondary flex items-center gap-2">
                                    <Package size={20} className="text-primary" /> {order.id}
                                </h3>
                                <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mt-1">
                                    <Clock size={14} /> {order.date}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-green-200 w-fit ml-auto md:mx-0 mb-1">
                                    <CheckCircle2 size={12} /> {order.status}
                                </span>
                                <p className="font-black text-secondary text-xl pr-1">₹{order.total}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 relative z-10">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-secondary">
                                            {item.qty}x
                                        </div>
                                        <span className="font-bold text-secondary">{item.name}</span>
                                    </div>
                                    <span className="font-black text-secondary whitespace-nowrap opacity-60">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                        </div>

                        {/* Reorder Button */}
                        <button className="w-full mt-6 py-3.5 rounded-xl border-2 border-primary text-primary font-black hover:bg-primary hover:text-white transition-colors">
                            Recompile Request (Reorder)
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
