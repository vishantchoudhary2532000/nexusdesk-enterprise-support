'use client';

import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { Hexagon, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingNav() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Resources', href: '#' },
    ];

    return (
        <header className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
            isScrolled ? 'py-4 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'
        }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo Area */}
                <NextLink href="/" className="flex items-center gap-3 group relative z-[110]">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <div className="relative bg-gradient-to-br from-indigo-500/20 to-violet-600/20 p-2 rounded-xl border border-white/10 shadow-2xl">
                            <Hexagon className="w-6 h-6 text-indigo-400 fill-indigo-400/5 group-hover:rotate-90 transition-transform duration-700" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-white tracking-widest uppercase mb-[-4px]">NexusDesk</span>
                        <span className="text-[8px] font-black text-slate-500 tracking-[0.4em] uppercase">Intelligence Node</span>
                    </div>
                </NextLink>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-12">
                    {navLinks.map((link) => (
                        <NextLink 
                            key={link.name} 
                            href={link.href === '#' ? '/docs' : link.href}
                            className="text-[11px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-all relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-indigo-500 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        </NextLink>
                    ))}
                </nav>

                {/* Action Area */}
                <div className="flex items-center gap-6 relative z-[110]">
                    <NextLink 
                        href="/login" 
                        className="hidden sm:block text-[11px] font-black text-slate-400 hover:text-white uppercase tracking-[0.2em] transition-all"
                    >
                        Sign In
                    </NextLink>
                    <NextLink 
                        href="/signup" 
                        className="inline-flex items-center gap-3 bg-white text-[#0b0f19] px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] group"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </NextLink>

                    {/* Mobile Menu Toggle */}
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-x-0 top-0 h-screen bg-[#0b0f19]/98 backdrop-blur-2xl z-[105] flex flex-col p-8 pt-32 gap-8 border-b border-white/5"
                    >
                        {navLinks.map((link) => (
                            <NextLink 
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-4xl font-black text-white uppercase tracking-tighter"
                            >
                                {link.name}
                            </NextLink>
                        ))}
                        <div className="mt-auto flex flex-col gap-4">
                            <NextLink 
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full bg-white/5 border border-white/10 text-white text-center py-5 rounded-3xl text-sm font-black uppercase tracking-widest"
                            >
                                Existing Node Access
                            </NextLink>
                            <NextLink 
                                href="/signup"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-center py-5 rounded-3xl text-sm font-black uppercase tracking-widest"
                            >
                                Initialize Core
                            </NextLink>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
