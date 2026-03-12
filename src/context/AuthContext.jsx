import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Load initial user state from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('tech_app_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
    }, []);

    const login = (email, password) => {
        // Mock login logic - in a real app this would hit an API
        const mockUser = {
            id: 'u-123',
            name: email.split('@')[0], // Use part of email as name for mock
            email: email,
            phone: '+91 98765 43210',
            avatar: email.charAt(0).toUpperCase(),
            savedItems: ['fw-1', 'lb-2'],
            role: 'customer'
        };
        setUser(mockUser);
        localStorage.setItem('tech_app_user', JSON.stringify(mockUser));
        return true;
    };

    const loginOfficial = (id, password) => {
        // Mock official authentication
        if (id === 'admin' && password === 'admin123') {
            const mockAdmin = {
                id: 'sys-001',
                name: 'System Administrator',
                email: 'admin@techchaatwala.com',
                phone: '+91 00000 00000',
                avatar: '🛡️',
                role: 'official'
            };
            setUser(mockAdmin);
            localStorage.setItem('tech_app_user', JSON.stringify(mockAdmin));
            return true;
        }
        return false;
    };

    const signup = (name, email, password) => {
        // Mock signup logic
        const mockUser = {
            id: 'u-' + Date.now(),
            name: name,
            email: email,
            phone: '',
            avatar: name.charAt(0).toUpperCase(),
            savedItems: [],
            role: 'customer'
        };
        setUser(mockUser);
        localStorage.setItem('tech_app_user', JSON.stringify(mockUser));
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('tech_app_user');
    };

    const updateProfile = (updates) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('tech_app_user', JSON.stringify(updatedUser));
    };

    const toggleSavedItem = (itemId) => {
        if (!user) return;
        const savedItems = user.savedItems || [];
        const isSaved = savedItems.includes(itemId);
        const newSavedItems = isSaved
            ? savedItems.filter(id => id !== itemId)
            : [...savedItems, itemId];

        updateProfile({ savedItems: newSavedItems });
    };

    return (
        <AuthContext.Provider value={{ user, login, loginOfficial, signup, logout, updateProfile, toggleSavedItem }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
