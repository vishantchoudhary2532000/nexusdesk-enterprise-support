'use client';

import React from 'react';

/**
 * Combined props for both Input and Textarea elements to support the 'multiline' toggle
 * and common attributes like 'rows' without TypeScript errors.
 */
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & 
                  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    multiline?: boolean;
};

export default function Input({ label, error, multiline, className = '', ...props }: InputProps) {
    const Component = multiline ? 'textarea' : 'input';
    const baseStyles = "w-full bg-slate-950/40 border border-white/5 rounded-[1.25rem] px-6 py-4 text-[13px] text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all shadow-inner font-bold";
    
    return (
        <div className="w-full space-y-2.5">
            {label && (
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    {label}
                </label>
            )}
            <Component
                className={`${baseStyles} ${error ? 'border-rose-500/30 focus:border-rose-500/50' : ''} ${className}`}
                {...(props as any)}
            />
            {error && <p className="text-[11px] text-red-400 ml-1">{error}</p>}
        </div>
    );
}
