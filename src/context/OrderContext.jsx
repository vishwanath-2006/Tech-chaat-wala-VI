import React, { createContext, useState, useContext, useEffect } from 'react';

const OrderContext = createContext();

// Mock Initial Orders to give the dashboard something to display immediately
const INITIAL_ORDERS = [
    {
        id: '1021',
        items: [{ name: 'Sprout Circuit Salad', prepTime: 3, qty: 1 }, { name: 'Latency-Free Lemonade', prepTime: 1, qty: 2 }],
        status: 'completed',
        timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
        prepTime: 3,
        total: 307
    },
    {
        id: '1022',
        items: [{ name: 'Protein Packet Paneer', prepTime: 4, qty: 2 }],
        status: 'ready',
        timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
        prepTime: 4,
        total: 378
    },
    {
        id: '1023',
        items: [{ name: 'Async Avocado Wrap', prepTime: 4, qty: 1 }],
        status: 'cooking',
        timestamp: Date.now() - 1000 * 60 * 2, // 2 mins ago
        prepTime: 5,
        total: 249
    }
];

export const OrderProvider = ({ children }) => {
    // Load from local storage or use initial
    const [orders, setOrders] = useState(() => {
        try {
            const saved = localStorage.getItem('tcw_orders');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // Normalize statuses on load for robustness
                    return parsed.map(o => ({
                        ...o,
                        status: String(o.status).toUpperCase(),
                        paymentStatus: o.paymentStatus || (o.status === 'COMPLETED' ? 'Paid' : 'Pending')
                    }));
                }
            }
        } catch (e) { console.error(e); }
        
        return INITIAL_ORDERS.map(o => ({
            ...o,
            status: String(o.status).toUpperCase(),
            paymentStatus: 'Paid',
            paymentMethod: 'UPI'
        }));
    });

    // Cross-tab synchronization
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'tcw_orders' && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    if (Array.isArray(parsed)) {
                        setOrders(parsed.map(o => ({
                            ...o,
                            status: String(o.status).toUpperCase()
                        })));
                    }
                } catch (err) { console.error("Sync error:", err); }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        localStorage.setItem('tcw_orders', JSON.stringify(orders));
    }, [orders]);

    // Add a new order (from customer checkout)
    const addOrder = (orderData) => {
        const newOrderId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;

        // Calculate prep time: longest item + 1 min for packaging
        const maxItemPrepTime = Math.max(1, ...(orderData.items || []).map(i => i.prepTime || 3));
        const basePrepTime = maxItemPrepTime + 1;

        const newOrder = {
            id: newOrderId,
            status: orderData.paymentStatus === 'Paid' ? 'PENDING' : 'Awaiting Payment',
            paymentStatus: orderData.paymentStatus || 'Pending',
            paymentMethod: orderData.paymentMethod || 'Counter',
            timestamp: Date.now(),
            prepTime: basePrepTime,
            ...orderData
        };

        setOrders(prev => [...prev, newOrder]);
        return newOrderId; // Return ID so Success page can track it
    };

    // Admin updates status 
    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(prev => prev.map(order => {
            if (order.id === orderId) {
                // If payment was pending and now it's paid, move to PENDING status for kitchen
                if (order.paymentStatus === 'Pending' && newStatus === 'Paid') {
                    return { ...order, paymentStatus: 'Paid', status: 'PENDING' };
                }
                return { ...order, status: newStatus };
            }
            return order;
        }));
    };

    // Admin updates preparation time
    const updateOrderPrepTime = (orderId, newPrepTime) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, prepTime: newPrepTime } : order
        ));
    };

    // Get specific order details
    const getOrder = (orderId) => {
        return orders.find(o => o.id === orderId);
    };

    // Calculate queue stats for a specific order
    const getQueueStats = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return { ordersAhead: 0, position: 0, waitTimeMins: 0 };

        const activeStatuses = ['PENDING', 'ACCEPTED', 'PREPARING'];
        const activeOrders = orders.filter(o => activeStatuses.includes(o.status));

        // Sort by timestamp (oldest first)
        activeOrders.sort((a, b) => a.timestamp - b.timestamp);

        const myIndex = activeOrders.findIndex(o => o.id === orderId);

        if (myIndex === -1) {
            // Probably ready or completed or awaiting payment
            return { ordersAhead: 0, position: 1, waitTimeMins: 0 };
        }

        const ordersAhead = myIndex;
        // Estimate 2 minutes per order ahead, plus 2 mins for yours
        const waitTimeMins = (ordersAhead * 2) + 1;

        return {
            ordersAhead,
            position: myIndex + 1,
            waitTimeMins
        };
    };

    return (
        <OrderContext.Provider value={{
            orders,
            addOrder,
            updateOrderStatus,
            updateOrderPrepTime,
            getOrder,
            getQueueStats
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    return useContext(OrderContext);
};
