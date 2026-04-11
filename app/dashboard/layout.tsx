'use client';

import { OrganizationProvider } from '../../components/OrganizationProvider';
import Sidebar from '../../components/Sidebar';
import DashboardHeader from '../../components/DashboardHeader';

import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <OrganizationProvider>
            <div className="flex h-screen overflow-hidden bg-[#0b0f19] font-sans noise-bg">
                <Sidebar />
                <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 md:pl-0 pl-16">
                    <DashboardHeader />
                    <motion.main 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto custom-scrollbar"
                    >
                        {children}
                    </motion.main>
                </div>
            </div>
        </OrganizationProvider>
    );
}
