'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: Option[];
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
    variant?: 'default' | 'success' | 'warning' | 'error' | 'indigo';
}

export default function CustomSelect({ 
    value, 
    onChange, 
    options, 
    placeholder = "Select...", 
    icon, 
    className = "",
    variant = 'default' 
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const variantStyles = {
        default: "bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800/80",
        success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20",
        warning: "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20",
        error: "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20",
        indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20"
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                className={`w-full flex items-center justify-between border rounded-xl text-[11px] font-bold shadow-sm outline-none transition-all px-3 py-2 ${variantStyles[variant]} ${className}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 truncate">
                    {icon && <span className="opacity-60 shrink-0">{icon}</span>}
                    <span className="truncate uppercase tracking-wider">{selectedOption ? selectedOption.label : placeholder}</span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-[100] w-full mt-2 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden min-w-[160px]"
                    >
                        <div className="max-h-60 overflow-y-auto py-1.5 custom-scrollbar">
                            {options.map((option) => {
                                const isSelected = option.value === value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center justify-between group ${isSelected
                                                ? 'bg-indigo-500/10 text-indigo-400'
                                                : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                                            }`}
                                    >
                                        <span className="truncate">{option.label}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
