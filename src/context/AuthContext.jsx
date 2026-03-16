import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(() => {
        // Persistent guest state
        return localStorage.getItem('isGuest') === 'true';
    });
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
                // If we get an explicit logout/null session, we don't auto-clear guest 
                // but we check if we should
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signup = async (email, password, fullName, role = "customer") => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role: role
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
        setIsGuest(false);
        localStorage.removeItem('isGuest');
    };

    const continueAsGuest = () => {
        setIsGuest(true);
        localStorage.setItem('isGuest', 'true');
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
        <AuthContext.Provider value={{ 
            user, 
            isGuest, 
            loading, 
            signup, 
            login, 
            logout, 
            continueAsGuest, 
            updateProfile, 
            toggleSavedItem 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
