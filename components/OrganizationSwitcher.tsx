'use client';

import { useState, useRef, useEffect } from 'react';
import { useOrganization } from './OrganizationProvider';
import { ChevronDown, Building2, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrganizationSwitcher() {
    const { organizations, activeOrganization, setActiveOrganization, loading } = useOrganization();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (loading) {
        return <div className="animate-pulse bg-slate-800/40 h-14 rounded-2xl mx-6 my-4 border border-slate-800/60"></div>;
    }

    if (!activeOrganization) return null;

    return (
        <div className="relative mx-6 my-4" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between border rounded-[1.25rem] px-4 py-3 transition-all cursor-pointer text-left focus:outline-none ${isOpen 
                    ? 'bg-indigo-500/10 border-indigo-500/30' 
                    : 'bg-slate-900 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/80 shadow-lg'
                }`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20 shrink-0">
                        <Building2 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="truncate">
                        <p className="text-[13px] font-bold text-white truncate tracking-tight">{activeOrganization.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-50" />
                             <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-500">{activeOrganization.role}</p>
                        </div>
                    </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full left-0 right-0 mb-4 bg-[#0a0f1a]/95 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[1.75rem] z-50 overflow-hidden"
                    >
                        <header className="px-6 py-4 border-b border-white/[0.05] bg-white/[0.02]">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Operational Node Selection</p>
                        </header>
                        <div className="p-2.5 max-h-64 overflow-y-auto custom-scrollbar">
                            {organizations.map((org) => (
                                <button
                                    key={org.id}
                                    onClick={() => {
                                        setActiveOrganization(org.id);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-5 py-4 rounded-2xl text-[13px] flex items-center justify-between group transition-all cursor-pointer mb-1.5 last:mb-0 ${activeOrganization.id === org.id
                                            ? 'bg-indigo-500/10 text-indigo-400'
                                            : 'text-slate-400 hover:bg-white/[0.03] hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-4 truncate">
                                         {activeOrganization.id === org.id ? (
                                             <div className="relative">
                                                 <div className="absolute inset-0 bg-indigo-400 blur-md opacity-40 animate-pulse" />
                                                 <Star className="w-4 h-4 fill-indigo-400 text-indigo-400 relative z-10" />
                                             </div>
                                         ) : (
                                             <div className="w-4 h-4 rounded-full border border-slate-800 shrink-0 group-hover:border-slate-700 transition-colors" />
                                         )}
                                         <span className={`truncate font-bold ${activeOrganization.id === org.id ? 'text-indigo-400' : ''}`}>{org.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${activeOrganization.id === org.id ? 'text-indigo-500' : 'text-slate-600'}`}>
                                            {org.role === 'admin' ? 'Root' : 'Op'}
                                        </span>
                                        {activeOrganization.id === org.id && <Check className="w-4 h-4 text-indigo-500 shrink-0" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <footer className="px-6 py-4 bg-white/[0.01] border-t border-white/[0.05] flex items-center justify-center">
                             <button className="text-[10px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-[0.2em] transition-all flex items-center gap-2 group">
                                 <div className="w-4 h-4 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/10 transition-colors">
                                     <span className="text-[14px] leading-none text-slate-500 group-hover:text-indigo-400">+</span>
                                 </div>
                                 Initialize New Node
                             </button>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
