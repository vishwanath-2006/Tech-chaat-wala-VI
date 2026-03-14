import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import Processing from './pages/Processing';
import Success from './pages/Success';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OfficialLogin from './pages/OfficialLogin';
import AdminDashboard from './pages/AdminDashboard';
import SavedItems from './pages/SavedItems';
import Settings from './pages/Settings';
import ReactionRobot from './components/ui/ReactionRobot';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MenuProvider } from './context/MenuContext';
import { OrderProvider } from './context/OrderContext';
import ProtectedRoute from './components/ProtectedRoute';

const HomeRedirect = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse">Initializing System...</p>
                </div>
            </div>
        );
    }

    if (user?.role === 'staff') {
        return <Navigate to="/admin" replace />;
    }

    if (user?.role === 'customer') {
        return <Navigate to="/menu" replace />;
    }

    // Default to login gate for everyone else
    return <Navigate to="/login" replace />;
};

function App() {
    const [cart, setCart] = useState({});
    const [reactionTrigger, setReactionTrigger] = useState(0);
    const [reactionEvent, setReactionEvent] = useState('add');

    const triggerRobot = (eventType) => {
        setReactionEvent(eventType);
        setReactionTrigger(t => t + 1);
    };

    const updateCart = (productId, delta) => {
        setCart(prev => {
            const current = prev[productId] || 0;
            const next = Math.max(0, current + delta);

            // Trigger robot reaction on addition
            if (delta > 0) {
                triggerRobot('add');
            }

            if (next === 0) {
                const newCart = { ...prev };
                delete newCart[productId];
                return newCart;
            }
            return { ...prev, [productId]: next };
        });
    };

    const handleReset = () => {
        setCart({});
    };

    return (
        <AuthProvider>
            <MenuProvider>
                <OrderProvider>
                    <BrowserRouter>
                        <div className="min-h-screen bg-background text-textDark font-sans selection:bg-primary/20 selection:text-primary">
                            <Routes>
                                <Route path="/" element={<HomeRedirect />} />
                                <Route
                                    path="/menu"
                                    element={<ProtectedRoute><Menu cart={cart} updateCart={updateCart} triggerRobot={triggerRobot} /></ProtectedRoute>}
                                />
                                <Route path="/checkout" element={
                                    <ProtectedRoute>
                                        <Checkout cart={cart} updateCart={updateCart} />
                                    </ProtectedRoute>
                                } />
                                <Route path="/processing" element={
                                    <ProtectedRoute>
                                        <Processing />
                                    </ProtectedRoute>
                                } />
                                <Route path="/success" element={
                                    <ProtectedRoute>
                                        <Success onReset={handleReset} />
                                    </ProtectedRoute>
                                } />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } />
                                <Route path="/orders" element={
                                    <ProtectedRoute>
                                        <Orders />
                                    </ProtectedRoute>
                                } />
                                <Route path="/saved" element={
                                    <ProtectedRoute>
                                        <SavedItems />
                                    </ProtectedRoute>
                                } />
                                <Route path="/settings" element={
                                    <ProtectedRoute>
                                        <Settings />
                                    </ProtectedRoute>
                                } />
                                <Route path="/official-login" element={<OfficialLogin />} />
                                <Route path="/admin" element={
                                    <ProtectedRoute requiredRole="staff">
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>

                            {/* Global AI Reaction Assistant */}
                            <ReactionRobot trigger={reactionTrigger} eventType={reactionEvent} />
                        </div>
                    </BrowserRouter>
                </OrderProvider>
            </MenuProvider>
        </AuthProvider>
    );
}

export default App;

