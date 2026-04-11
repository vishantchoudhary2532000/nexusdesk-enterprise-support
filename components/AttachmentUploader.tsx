import { useState } from 'react';
import { Paperclip, X, Loader2 } from 'lucide-react';
import { createClient } from '../lib/supabaseClient';

interface AttachmentUploaderProps {
    ticketId: string;
    onUploadComplete: (url: string) => void;
    onReset: () => void;
}

export default function AttachmentUploader({ ticketId, onUploadComplete, onReset }: AttachmentUploaderProps) {
    const supabase = createClient();
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not logged in');

            const fileExt = file.name.split('.').pop();
            const uniqueName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `tickets/${ticketId}/${uniqueName}`;

            const { error: uploadError } = await supabase.storage
                .from('ticket-files')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('ticket-files')
                .getPublicUrl(filePath);

            setFileName(file.name);
            onUploadComplete(publicUrlData.publicUrl);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file.');
        } finally {
            setUploading(false);
        }
    };

    if (fileName) {
        return (
            <div className="flex items-center gap-2 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-lg border border-violet-100 text-xs font-semibold">
                <Paperclip className="w-3.5 h-3.5" />
                <span className="truncate max-w-[150px]">{fileName}</span>
                <button
                    onClick={() => {
                        setFileName(null);
                        onReset();
                    }}
                    className="ml-1 hover:text-red-500 transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        );
    }

    return (
        <div className="relative">
            <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
            />
            <label
                htmlFor="file-upload"
                className={`flex items-center justify-center p-2.5 rounded-xl cursor-pointer transition-colors ${uploading ? 'bg-slate-100 text-slate-400' : 'bg-slate-50 text-slate-500 hover:text-violet-600 hover:bg-violet-50'}`}
            >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
            </label>
        </div>
    );
}
