import React, { useState, useRef, useEffect } from 'react';
import { User, LogIn, UserPlus, FileText, Bookmark, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProfileDropdown = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Handle outside clicks to close the dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (route) => {
        setIsOpen(false);
        navigate(route);
    };

    const handleLogout = () => {
        setIsOpen(false);
        logout();
        navigate('/'); // Optional redirect
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-secondary active:scale-95 border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
                {user ? (
                    <span className="font-black text-primary text-lg">{user.avatar}</span>
                ) : (
                    <User size={18} />
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface border border-slate-100 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in flex flex-col overflow-hidden">

                    {/* Header Banner */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 mb-1">
                        {user ? (
                            <>
                                <p className="text-sm font-black text-secondary truncate">{user.name}</p>
                                <p className="text-xs text-textLight font-mono truncate">{user.email}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm font-black text-secondary">Guest User</p>
                                <p className="text-[10px] text-textLight uppercase tracking-widest mt-0.5">Not logged in</p>
                            </>
                        )}
                    </div>

                    {/* Actions List */}
                    <div className="flex flex-col py-1">
                        {user ? (
                            <>
                                {user.role === 'official' ? (
                                    <button onClick={() => handleAction('/admin')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-secondary hover:bg-slate-50 transition-colors w-full text-left bg-primary/5 border-l-4 border-primary">
                                        <Settings size={16} className="text-primary" /> Admin Terminal
                                    </button>
                                ) : (
                                    <>
                                        <button onClick={() => handleAction('/profile')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-secondary hover:bg-slate-50 transition-colors w-full text-left">
                                            <User size={16} className="text-primary" /> View Profile
                                        </button>
                                        <button onClick={() => handleAction('/orders')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-secondary hover:bg-slate-50 transition-colors w-full text-left">
                                            <FileText size={16} className="text-primary" /> Order History
                                        </button>
                                    </>
                                )}
                                <button onClick={() => handleAction('/saved')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-secondary hover:bg-slate-50 transition-colors w-full text-left">
                                    <Bookmark size={16} className="text-primary" /> Saved Items
                                </button>
                                <button onClick={() => handleAction('/settings')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-secondary hover:bg-slate-50 transition-colors w-full text-left">
                                    <Settings size={16} className="text-primary" /> Settings
                                </button>

                                <div className="h-px bg-slate-100 my-1 mx-4" />

                                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors w-full text-left mt-1">
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleAction('/login')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-secondary hover:bg-slate-50 transition-colors w-full text-left">
                                    <LogIn size={16} className="text-primary" /> Login
                                </button>
                                <button onClick={() => handleAction('/signup')} className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-secondary hover:bg-slate-50 transition-colors w-full text-left">
                                    <UserPlus size={16} className="text-primary" /> Sign Up
                                </button>

                                <div className="h-px bg-slate-100 my-1 mx-4" />

                                <button disabled className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-300 w-full text-left cursor-not-allowed">
                                    <User size={16} /> View Profile
                                </button>
                                <button disabled className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-300 w-full text-left cursor-not-allowed">
                                    <FileText size={16} /> Order History
                                </button>

                                <div className="h-px bg-slate-100 my-1 mx-4" />

                                <button onClick={() => handleAction('/official-login')} className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-textLight hover:bg-slate-50 transition-colors w-full text-left uppercase tracking-widest">
                                    <Settings size={12} /> Login as Official
                                </button>
                            </>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
