'use client';

import { Search, Filter, ArrowUpDown } from 'lucide-react';
import CustomSelect from './CustomSelect';
import { motion } from 'framer-motion';

interface TicketFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    priorityFilter: string;
    setPriorityFilter: (priority: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
}

const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Open', value: 'open' },
    { label: 'Pending', value: 'pending' },
    { label: 'Closed', value: 'closed' }
];

const priorityOptions = [
    { label: 'All Priorities', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' }
];

const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Highest Prio', value: 'priority' }
];

export default function TicketFilters({
    searchQuery, setSearchQuery,
    statusFilter, setStatusFilter,
    priorityFilter, setPriorityFilter,
    sortBy, setSortBy
}: TicketFiltersProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f172a]/60 backdrop-blur-3xl p-3 rounded-[2.5rem] border border-white/[0.05] flex flex-col md:flex-row gap-3 relative overflow-visible group shadow-2xl z-40"
        >
            <div className="flex-1 relative group/search">
                <Search className="w-4 h-4 text-slate-500 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within/search:text-indigo-400 transition-colors z-10" />
                <input
                    type="text"
                    placeholder="Search technical identifiers..."
                    className="w-full pl-14 pr-8 py-4 bg-slate-950/40 rounded-[2rem] text-[13px] border border-white/5 outline-none transition-all placeholder:text-slate-600 font-bold text-slate-300 focus:border-indigo-500/30 group-hover/search:bg-slate-950/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex gap-2 p-1.5 bg-slate-950/40 rounded-[2rem] border border-white/[0.03]">
                <div className="w-[150px]">
                    <CustomSelect
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={statusOptions}
                        icon={<Filter className="w-3.5 h-3.5" />}
                        className="py-3 px-5 bg-transparent border-none hover:bg-white/5 rounded-2xl transition-colors"
                    />
                </div>

                <div className="w-[150px]">
                    <CustomSelect
                        value={priorityFilter}
                        onChange={setPriorityFilter}
                        options={priorityOptions}
                        icon={<Filter className="w-3.5 h-3.5" />}
                        className="py-3 px-5 bg-transparent border-none hover:bg-white/5 rounded-2xl transition-colors"
                    />
                </div>

                <div className="w-[150px]">
                    <CustomSelect
                        value={sortBy}
                        onChange={setSortBy}
                        options={sortOptions}
                        icon={<ArrowUpDown className="w-3.5 h-3.5" />}
                        className="py-3 px-5 bg-transparent border-none hover:bg-white/5 rounded-2xl transition-colors"
                    />
                </div>
            </div>
        </motion.div>
    );
}
