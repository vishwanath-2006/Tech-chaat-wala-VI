import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Edit2, Save, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.full_name || user?.name || '',
        phone: user?.user_metadata?.phone || user?.phone || ''
    });

    // Update form if user data loads late
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.user_metadata?.full_name || user.name || '',
                phone: user.user_metadata?.phone || user.phone || ''
            });
        }
    }, [user]);

    if (!user) return null;

    const handleSave = async () => {
        try {
            await updateProfile({
                full_name: formData.name,
                phone: formData.phone
            });
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile:", err.message);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 relative">
            <button
                onClick={() => navigate('/menu')}
                className="absolute top-6 left-6 w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm hover:shadow-md transition-all border border-slate-200 z-10"
            >
                <ArrowLeft size={20} />
            </button>

            <div className="max-w-2xl mx-auto pt-16">
                <div className="text-center mb-10">
                    <div className="w-32 h-32 rounded-full bg-slate-100 mx-auto flex items-center justify-center mb-6 shadow-inner border-4 border-white relative">
                        <span className="text-5xl font-black text-primary">{user.avatar}</span>
                        {isEditing && (
                            <button className="absolute bottom-0 right-0 w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg">
                                <Edit2 size={16} />
                            </button>
                        )}
                    </div>
                    <h1 className="text-4xl font-black text-secondary leading-tight">{formData.name}</h1>
                    <div className="flex flex-col items-center gap-1">
                        <p className="text-slate-500 font-medium">Verified User Level 1</p>
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-mono font-bold border border-blue-100 uppercase tracking-tighter">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            Project ID: {import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'NOT_FOUND'}
                        </div>
                    </div>
                </div>

                <div className="surface-card p-8 rounded-[32px] bg-white border border-slate-100 shadow-xl mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-secondary">Profile Details</h2>
                        <button
                            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isEditing ? 'bg-primary text-white shadow-md' : 'bg-slate-100 text-secondary hover:bg-slate-200'}`}
                        >
                            {isEditing ? <><Save size={16} /> Save</> : <><Edit2 size={16} /> Edit</>}
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                            {isEditing ? (
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-secondary font-bold focus:outline-none focus:border-primary"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            ) : (
                                <p className="text-secondary font-bold text-lg">{formData.name}</p>
                            )}
                        </div>

                        {/* Email Field (Static) */}
                        <div>
                            <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest block mb-1">Email <span className="lowercase normal-case text-xs text-slate-300 ml-2">(Cannot edit login node)</span></label>
                            <p className="text-secondary font-bold text-lg opacity-60">{user.email}</p>
                        </div>

                        {/* Phone Field */}
                        <div>
                            <label className="text-sm font-semibold text-slate-400 uppercase tracking-widest block mb-1">Terminal Contact (Phone)</label>
                            {isEditing ? (
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-secondary font-bold focus:outline-none focus:border-primary"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91..."
                                />
                            ) : (
                                <p className="text-secondary font-bold text-lg">{formData.phone || 'Not configured.'}</p>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-500 font-bold py-4 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                    <LogOut size={20} /> Terminate Session
                </button>
            </div>
        </div>
    );
};

export default Profile;
