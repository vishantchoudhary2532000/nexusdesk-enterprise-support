'use client';

import { useState, useEffect } from 'react';
import { createClient } from '../lib/supabaseClient';
import { useOrganization } from './OrganizationProvider';
import { Camera, Loader2, Save, KeyRound, Building, User } from 'lucide-react';
import Image from 'next/image';

export default function AccountSettings() {
    const supabase = createClient();
    const { activeOrganization } = useOrganization();

    // Profile State
    const [userId, setUserId] = useState<string | null>(null);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordMsg, setPasswordMsg] = useState({ text: '', type: '' });

    // File Upload State
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
                if (data) {
                    setFullName(data.full_name || '');
                    setAvatarUrl(data.avatar_url || null);
                }
            }
            setProfileLoading(false);
        };
        fetchProfile();
    }, [supabase]);

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;
        setProfileSaving(true);
        setProfileMsg({ text: '', type: '' });

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName, updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) {
            setProfileMsg({ text: error.message, type: 'error' });
        } else {
            setProfileMsg({ text: 'Profile updated successfully.', type: 'success' });
        }
        setProfileSaving(false);
        setTimeout(() => setProfileMsg({ text: '', type: '' }), 3000);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMsg({ text: '', type: '' });

        if (newPassword !== confirmPassword) {
            setPasswordMsg({ text: 'Passwords do not match.', type: 'error' });
            return;
        }
        if (newPassword.length < 6) {
            setPasswordMsg({ text: 'Password must be at least 6 characters.', type: 'error' });
            return;
        }

        setPasswordSaving(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            setPasswordMsg({ text: error.message, type: 'error' });
        } else {
            setPasswordMsg({ text: 'Password updated successfully.', type: 'success' });
            setNewPassword('');
            setConfirmPassword('');
        }
        setPasswordSaving(false);
        setTimeout(() => setPasswordMsg({ text: '', type: '' }), 3000);
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !userId) return;
        const file = e.target.files[0];

        setUploadingAvatar(true);
        const fileExt = file.name.split('.').pop();
        const filePath = `${userId}/${Math.random()}.${fileExt}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) {
            setProfileMsg({ text: uploadError.message, type: 'error' });
            setUploadingAvatar(false);
            return;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

        // Update profile
        await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', userId);
        setAvatarUrl(publicUrl);
        setUploadingAvatar(false);
        setProfileMsg({ text: 'Avatar updated successfully.', type: 'success' });
        setTimeout(() => setProfileMsg({ text: '', type: '' }), 3000);
    };

    if (profileLoading) {
        return <div className="p-8 flex items-center justify-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
                <p className="text-slate-500 mt-1">Manage your personal profile, security, and preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Profile Section */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="border-b border-slate-100 p-6 flex items-center gap-3">
                            <User className="w-5 h-5 text-violet-600" />
                            <h2 className="text-lg font-bold text-slate-900">Public Profile</h2>
                        </div>
                        <div className="p-6">
                            {profileMsg.text && (
                                <div className={`p-4 mb-6 rounded-xl text-sm font-medium border ${profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {profileMsg.text}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-8 items-start mb-8">
                                <div className="relative group shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                                        {avatarUrl ? (
                                            <Image src={avatarUrl} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-10 h-10 text-slate-300" />
                                        )}
                                    </div>
                                    <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-50 shadow-sm transition-colors z-10">
                                        {uploadingAvatar ? <Loader2 className="w-4 h-4 text-violet-600 animate-spin" /> : <Camera className="w-4 h-4 text-slate-600" />}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                                    </label>
                                </div>
                                <div className="flex-1 w-full">
                                    <form onSubmit={handleProfileSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 transition-all"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={profileSaving}
                                            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2 group disabled:opacity-50"
                                        >
                                            {profileSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="border-b border-slate-100 p-6 flex items-center gap-3">
                            <KeyRound className="w-5 h-5 text-indigo-600" />
                            <h2 className="text-lg font-bold text-slate-900">Security</h2>
                        </div>
                        <div className="p-6">
                            {passwordMsg.text && (
                                <div className={`p-4 mb-6 rounded-xl text-sm font-medium border ${passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                    {passwordMsg.text}
                                </div>
                            )}

                            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Retype new password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={passwordSaving || (!newPassword && !confirmPassword)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Org Summary Sidebar */}
                <div className="md:col-span-1">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/30 rounded-full blur-2xl"></div>
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <Building className="w-5 h-5 text-indigo-400" />
                            <h2 className="text-lg font-bold">Workspace</h2>
                        </div>

                        {activeOrganization ? (
                            <div className="space-y-4 relative z-10 text-sm">
                                <div>
                                    <p className="text-slate-400 mb-1">Active Organization</p>
                                    <p className="font-bold text-white text-base">{activeOrganization.name}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 mb-1">Your Role</p>
                                    <span className={`inline-block px-2.5 py-1 rounded font-bold uppercase text-[10px] tracking-wider ${activeOrganization.role === 'owner' ? 'bg-amber-500/20 text-amber-300' : activeOrganization.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-300'}`}>
                                        {activeOrganization.role}
                                    </span>
                                </div>
                                <div className="pt-4 mt-4 border-t border-slate-700">
                                    <p className="text-slate-400 text-xs text-balance">Contact your organization owner if you need to upgrade limits or change subscription details.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-slate-400 relative z-10">
                                You are not currently active in any workspace.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
