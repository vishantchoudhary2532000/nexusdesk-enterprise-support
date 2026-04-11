'use client';

import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'indigo' | 'outline';
    className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
    const variants = {
        default: "bg-slate-800 text-slate-400 border-slate-700",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        error: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        outline: "bg-transparent border-slate-700 text-slate-400"
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
}
