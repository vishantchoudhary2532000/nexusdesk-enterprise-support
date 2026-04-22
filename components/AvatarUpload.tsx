'use client';

import { useState, useRef } from 'react';
import { createClient } from '../lib/supabaseClient';
import { Camera, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface AvatarUploadProps {
    uid: string;
    url: string | null;
    onUpload: (url: string) => void;
}

export default function AvatarUpload({ uid, url, onUpload }: AvatarUploadProps) {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${uid}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('profile-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('profile-files')
                .getPublicUrl(filePath);

            onUpload(publicUrl);
            toast.success('Neural Signature Updated');
        } catch (error: any) {
            toast.error('Upload Failed', { description: error.message });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative group">
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-2 border-white/10 group-hover:border-indigo-500/50 transition-all p-1 bg-slate-900 shadow-2xl"
                >
                    <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-white/[0.02] flex items-center justify-center relative">
                        {url ? (
                            <img src={url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-12 h-12 text-slate-700" />
                        )}
                        
                        {uploading && (
                            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                            </div>
                        )}
                    </div>
                </motion.div>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-2xl transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
                >
                    <Camera className="w-4 h-4" />
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={uploadAvatar}
                disabled={uploading}
                accept="image/*"
                className="hidden"
            />
            
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Neural Proxy Identity
            </p>
        </div>
    );
}
