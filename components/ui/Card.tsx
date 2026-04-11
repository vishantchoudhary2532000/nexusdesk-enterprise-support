'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
    onClick?: () => void;
}

export default function Card({ children, className = '', animate = true, onClick }: CardProps) {
    const Component = onClick ? motion.button : motion.div;
    
    return (
        <Component
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={animate ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={onClick ? { y: -2, transition: { duration: 0.2 } } : undefined}
            onClick={onClick}
            className={`glass p-6 rounded-2xl overflow-hidden relative group ${onClick ? 'text-left w-full cursor-pointer transition-colors hover:bg-slate-800/40' : ''} ${className}`}
        >
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="relative z-10">
                {children}
            </div>
        </Component>
    );
}
