import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, User, Bell, Monitor, Shield, Save, LogOut } from 'lucide-react';

const Settings = () => {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState('profile');

    // Mock States for UI
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
    });

    const [notifications, setNotifications] = useState({
        orderReady: true,
        kitchenUpdates: true,
        promos: false
    });

    const [systemPrefs, setSystemPrefs] = useState({
        soundEffects: true,
        robotMessages: true,
        uiAnimations: true,
        orderAlerts: true
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 text-center">
                <div>
                    <Shield size={48} className="text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-secondary mb-2">Access Restricted</h2>
                    <p className="text-slate-500 mb-6">Please log in to manage your preferences.</p>
                    <button onClick={() => navigate('/login')} className="btn-primary px-8 py-3">Login</button>
                </div>
            </div>
        );
    }

    const handleSaveProfile = (e) => {
        e.preventDefault();
        updateProfile(profileData);
        alert('Profile updated successfully!');
    };

    const handleLogoutAll = () => {
        if (window.confirm('Are you sure you want to log out from all devices?')) {
            logout();
            navigate('/');
        }
    };

    const ToggleSwitch = ({ checked, onChange, label, description }) => (
        <label className="flex items-center justify-between cursor-pointer p-4 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
            <div>
                <p className="font-bold text-secondary text-sm">{label}</p>
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
            </div>
            <div className="relative">
                <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
                <div className={`block w-12 h-7 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-slate-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${checked ? 'transform translate-x-5' : ''}`}></div>
            </div>
        </label>
    );

    return (
        <div className="min-h-screen bg-background pb-20">
            <header className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 h-16">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-secondary hover:bg-slate-100 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-lg font-black text-secondary">System Settings</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8 animate-fade-in">

                {/* Sidebar Navigation */}
                <div className="md:w-64 flex-shrink-0 space-y-2">
                    <button onClick={() => setActiveSection('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'profile' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <User size={18} /> Profile Settings
                    </button>
                    <button onClick={() => setActiveSection('notifications')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'notifications' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <Bell size={18} /> Notification Settings
                    </button>
                    <button onClick={() => setActiveSection('system')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'system' ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <Monitor size={18} /> System Preferences
                    </button>
                    <button onClick={() => setActiveSection('security')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeSection === 'security' ? 'bg-secondary text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
                        <Shield size={18} /> Security
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">

                    {activeSection === 'profile' && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-black text-secondary mb-6 border-b border-slate-100 pb-4">Profile Configuration</h2>
                            <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-3xl font-black text-primary overflow-hidden">
                                        {user.avatar}
                                    </div>
                                    <button type="button" className="btn-outline py-2 px-4 text-sm">Change Picture</button>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Full Name</label>
                                    <input type="text" value={profileData.name} onChange={e => setProfileData({ ...profileData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-secondary font-bold focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Email Address</label>
                                    <input type="email" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-secondary font-bold focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                                    <input type="tel" value={profileData.phone} onChange={e => setProfileData({ ...profileData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-secondary font-bold focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" />
                                </div>

                                <button type="submit" className="btn-primary w-full py-4 mt-8 flex items-center justify-center gap-2">
                                    <Save size={18} /> Save Changes
                                </button>
                            </form>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="animate-fade-in divide-y divide-slate-100 max-w-lg">
                            <h2 className="text-xl font-black text-secondary mb-2 border-b border-slate-100 pb-4">Notification Settings</h2>
                            <ToggleSwitch
                                label="Order Ready Notifications"
                                description="Receive a ping when your order is ready for pickup."
                                checked={notifications.orderReady}
                                onChange={(e) => setNotifications({ ...notifications, orderReady: e.target.checked })}
                            />
                            <ToggleSwitch
                                label="Live Kitchen Updates"
                                description="Get step-by-step progress as your meal is cooked."
                                checked={notifications.kitchenUpdates}
                                onChange={(e) => setNotifications({ ...notifications, kitchenUpdates: e.target.checked })}
                            />
                            <ToggleSwitch
                                label="Promotional Content"
                                description="Hear about new modular entries and limited-time discounts."
                                checked={notifications.promos}
                                onChange={(e) => setNotifications({ ...notifications, promos: e.target.checked })}
                            />
                        </div>
                    )}

                    {activeSection === 'system' && (
                        <div className="animate-fade-in divide-y divide-slate-100 max-w-lg">
                            <h2 className="text-xl font-black text-secondary mb-2 border-b border-slate-100 pb-4">System Preferences</h2>
                            <ToggleSwitch
                                label="Enable Sound Effects"
                                description="Allow interface clicks and alert sounds from the POS."
                                checked={systemPrefs.soundEffects}
                                onChange={(e) => setSystemPrefs({ ...systemPrefs, soundEffects: e.target.checked })}
                            />
                            <ToggleSwitch
                                label="Robot Assistant Messages"
                                description="Show AI reactive popups and dialog modules."
                                checked={systemPrefs.robotMessages}
                                onChange={(e) => setSystemPrefs({ ...systemPrefs, robotMessages: e.target.checked })}
                            />
                            <ToggleSwitch
                                label="Enable UI Animations"
                                description="Allow smooth transitions and glassmorphic rendering."
                                checked={systemPrefs.uiAnimations}
                                onChange={(e) => setSystemPrefs({ ...systemPrefs, uiAnimations: e.target.checked })}
                            />
                            <ToggleSwitch
                                label="Order Control Alerts"
                                description="For Admins: Sound alerts when new orders arrive."
                                checked={systemPrefs.orderAlerts}
                                onChange={(e) => setSystemPrefs({ ...systemPrefs, orderAlerts: e.target.checked })}
                            />
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="animate-fade-in max-w-lg">
                            <h2 className="text-xl font-black text-secondary mb-6 border-b border-slate-100 pb-4">Security Protocol</h2>

                            <div className="mb-8">
                                <h3 className="font-bold text-sm text-secondary mb-4">Change Password</h3>
                                <div className="space-y-4">
                                    <input type="password" placeholder="Current Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-secondary focus:border-primary outline-none" />
                                    <input type="password" placeholder="New Password" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-secondary focus:border-primary outline-none" />
                                    <button className="btn-outline py-3 w-full border-slate-300 text-slate-600 hover:bg-slate-100">Update Password</button>
                                </div>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
                                <h3 className="font-bold text-red-800 mb-2">Danger Zone</h3>
                                <p className="text-sm text-red-600 mb-4">Log out immediately from all active terminal sessions.</p>
                                <button onClick={handleLogoutAll} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors">
                                    <LogOut size={16} /> Terminate All Sessions
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Settings;
