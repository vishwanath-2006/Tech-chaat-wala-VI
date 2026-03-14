import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial session check and persistence
    useEffect(() => {
        const checkInitialSession = async () => {
            // Check for missing credentials
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
            
            if (!supabaseUrl || supabaseUrl === 'FILL_THIS_IN' || !supabaseKey || supabaseKey === 'FILL_THIS_IN') {
                console.error("CRITICAL: Supabase credentials are missing or placeholders. Auth will not function.");
                setLoading(false);
                return;
            }

            try {
                // Diagnostic: Log the project ID (masked) to help user verify the project
                if (supabaseUrl) {
                    const projectId = supabaseUrl.split('//')[1]?.split('.')[0];
                    console.log(`%c[SYSTEM DIAGNOSTIC] Connected to Supabase Project: ${projectId}`, "color: #3b82f6; font-weight: bold;");
                }

                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                
                if (session) {
                    const userData = {
                        ...session.user,
                        email: session.user.email,
                        role: session.user.user_metadata?.role || 'customer',
                        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                        avatar: (session.user.user_metadata?.full_name || 'U').charAt(0).toUpperCase()
                    };
                    setUser(userData);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("AuthContext: Session initialization failed:", err.message);
            } finally {
                setLoading(false);
            }
        };

        checkInitialSession();

        // Listen for all auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`AuthContext: Auth event [${event}] triggered`);
            if (session) {
                const userData = {
                    ...session.user,
                    email: session.user.email,
                    role: session.user.user_metadata?.role || 'customer',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                    avatar: (session.user.user_metadata?.full_name || 'U').charAt(0).toUpperCase()
                };
                setUser(userData);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signup = async (email, password, fullName) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: "customer"
                }
            }
        });
        if (error) throw error;
        return data;
    };

    const login = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) throw error;
        return data;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const updateProfile = async (updates) => {
        const { data, error } = await supabase.auth.updateUser({
            data: updates
        });
        if (error) throw error;
        return data;
    };

    const toggleSavedItem = async (itemId) => {
        if (!user) return;
        const savedItems = user.user_metadata?.savedItems || [];
        const isSaved = savedItems.includes(itemId);
        const newSavedItems = isSaved
            ? savedItems.filter(id => id !== itemId)
            : [...savedItems, itemId];

        await updateProfile({ savedItems: newSavedItems });
    };

    return (
        <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile, toggleSavedItem }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
