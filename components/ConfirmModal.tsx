'use client';

import { AlertTriangle, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, loading = false, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md" 
                    />
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-10 text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-8 mx-auto shadow-lg shadow-rose-500/5">
                                <AlertTriangle className="w-10 h-10 text-rose-500" />
                            </div>
                            
                            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">{title}</h3>
                            <p className="text-slate-400 font-medium leading-relaxed mb-10">{message}</p>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button 
                                    variant="secondary" 
                                    className="flex-1 rounded-2xl h-14" 
                                    onClick={onCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    variant="primary" 
                                    className="flex-1 rounded-2xl h-14 bg-rose-600 hover:bg-rose-500 border-rose-500/50 shadow-rose-600/20" 
                                    onClick={onConfirm}
                                    loading={loading}
                                >
                                    Proceed
                                </Button>
                            </div>
                        </div>
                        
                        <button 
                            onClick={onCancel} 
                            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/50 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
