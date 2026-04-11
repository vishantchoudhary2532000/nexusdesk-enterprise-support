'use client';

import React from 'react';

interface SkeletonProps {
    className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`relative overflow-hidden bg-white/[0.03] rounded-xl ${className}`}>
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent shadow-[0_0_20px_rgba(255,255,255,0.05)]" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent opacity-50" />
        </div>
    );
}
