'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<'button'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    loading,
    leftIcon,
    rightIcon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const actuallyLoading = isLoading || loading;
    const baseStyles = "inline-flex items-center justify-center rounded-[1.25rem] font-bold transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 active:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-widest text-[11px]";
    
    const variants = {
        primary: "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20 border border-white/10 hover:shadow-indigo-500/40",
        secondary: "bg-white/[0.03] text-slate-400 hover:bg-white/[0.08] hover:text-white border border-white/[0.05] shadow-xl",
        ghost: "bg-transparent text-slate-500 hover:bg-white/[0.03] hover:text-slate-200 border border-transparent hover:border-white/[0.02]",
        danger: "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 shadow-xl shadow-rose-500/5",
        outline: "bg-transparent border border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white shadow-lg"
    };
    
    const sizes = {
        sm: "px-5 py-2.5 gap-2",
        md: "px-7 py-3.5 gap-2.5",
        lg: "px-8 py-5 text-[12px] gap-3",
        icon: "p-3 aspect-square"
    };

    return (
        <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || actuallyLoading}
            {...props}
        >
            {actuallyLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {leftIcon}
                    {children}
                    {rightIcon}
                </>
            )}
        </motion.button>
    );
}
