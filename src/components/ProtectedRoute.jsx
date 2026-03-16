import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, isGuest } = useAuth();
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const location = useLocation();

    useEffect(() => {
        async function checkSession() {
            try {
                console.log("ProtectedRoute: Checking session...");
                const { data } = await supabase.auth.getSession();
                console.log("ProtectedRoute: Session found:", !!data.session);
                setSession(data.session);
            } catch (error) {
                console.error("ProtectedRoute: Session check failed:", error);
                setSession(null);
            } finally {
                setLoading(false);
            }
        }

        checkSession();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse">Verifying Session...</p>
                </div>
            </div>
        );
    }

    if (!session && !isGuest) {
        // Redirect to login if a valid Supabase session does not exist and NOT a guest
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        // Redirect to home if user doesn't have the required role
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
