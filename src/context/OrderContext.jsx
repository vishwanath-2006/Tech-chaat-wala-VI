import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial fetch from Supabase
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (error) throw error;

                if (data) {
                    setOrders(data.map(transformOrderFromDB));
                }
            } catch (err) {
                console.error('Error fetching orders:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

        // Real-time subscription
        const channel = supabase
            .channel('orders-realtime')
            .on('postgres_changes', { 
                event: '*', 
                schema: 'public', 
                table: 'orders' 
            }, (payload) => {
                console.log('Real-time update:', payload);
                if (payload.eventType === 'INSERT') {
                    setOrders(prev => [...prev, transformOrderFromDB(payload.new)]);
                } else if (payload.eventType === 'UPDATE') {
                    setOrders(prev => prev.map(o => 
                        o.id === payload.new.id ? transformOrderFromDB(payload.new) : o
                    ));
                } else if (payload.eventType === 'DELETE') {
                    setOrders(prev => prev.filter(o => o.id !== payload.old.id));
                }
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed to real-time updates');
                } else if (status === 'CHANNEL_ERROR') {
                    console.error('Real-time subscription failed');
                }
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    // Helper to transform DB record to UI state
    const transformOrderFromDB = (dbOrder) => ({
        id: dbOrder.id,
        items: dbOrder.items,
        total: parseFloat(dbOrder.total_price),
        status: dbOrder.order_status, // normalized to lowercase like 'pending'
        paymentStatus: dbOrder.payment_status,
        paymentMethod: dbOrder.payment_mode,
        timestamp: new Date(dbOrder.created_at).getTime(),
        prepTime: dbOrder.prep_time || 5, // Default if missing
    });

    // Helper to transform UI state to DB record
    const transformOrderToDB = (orderData) => ({
        items: orderData.items,
        total_price: orderData.total,
        payment_mode: orderData.paymentMethod || 'Counter',
        payment_status: orderData.paymentStatus || 'pending',
        order_status: orderData.status || 'pending',
        prep_time: orderData.prepTime || 5
    });

    // Add a new order (from customer checkout)
    const addOrder = async (orderData) => {
        try {
            // Calculate prep time: longest item + 1 min for packaging
            const maxItemPrepTime = Math.max(1, ...(orderData.items || []).map(i => i.prepTime || 3));
            const basePrepTime = maxItemPrepTime + 1;

            const dbOrder = {
                items: orderData.items,
                total_price: orderData.total,
                payment_mode: orderData.paymentMethod || 'Counter',
                payment_status: orderData.paymentStatus || 'pending',
                order_status: 'pending',
                prep_time: basePrepTime
            };

            const { data, error } = await supabase
                .from('orders')
                .insert([dbOrder])
                .select();

            if (error) throw error;
            
            console.log('Order created:', data[0]);
            return data[0].id; // Return UUID
        } catch (err) {
            console.error('Error creating order:', err.message);
            return null;
        }
    };

    // Admin updates status 
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            // Check if status needs processing for specific logic
            // e.g., if payment was pending and now it's paid, move to 'pending' for kitchen
            // But usually the buttons will send the exact target status
            
            const normalizedStatus = newStatus.toLowerCase();
            
            const { error } = await supabase
                .from('orders')
                .update({ order_status: normalizedStatus })
                .eq('id', orderId);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating order status:', err.message);
        }
    };

    // Admin updates payment status
    const updatePaymentStatus = async (orderId, newPaymentStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ payment_status: newPaymentStatus.toLowerCase() })
                .eq('id', orderId);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating payment status:', err.message);
        }
    };

    // Admin updates preparation time
    const updateOrderPrepTime = async (orderId, newPrepTime) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ prep_time: newPrepTime })
                .eq('id', orderId);

            if (error) throw error;
        } catch (err) {
            console.error('Error updating prep time:', err.message);
        }
    };

    // Get specific order details
    const getOrder = (orderId) => {
        return orders.find(o => o.id === orderId);
    };

    // Calculate queue stats for a specific order
    const getQueueStats = (orderId) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return { ordersAhead: 0, position: 0, waitTimeMins: 0 };

        const activeStatuses = ['pending', 'accepted', 'preparing'];
        // Sort by timestamp (oldest first)
        const activeOrders = orders
            .filter(o => activeStatuses.includes(o.status))
            .sort((a, b) => a.timestamp - b.timestamp);

        const myIndex = activeOrders.findIndex(o => o.id === orderId);

        if (myIndex === -1) {
            return { ordersAhead: 0, position: 1, waitTimeMins: 0 };
        }

        const ordersAhead = myIndex;
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
            loading,
            addOrder,
            updateOrderStatus,
            updatePaymentStatus,
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
