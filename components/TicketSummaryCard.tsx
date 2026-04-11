'use client';

import { Sparkles, History } from 'lucide-react';

interface TicketSummaryCardProps {
    summary: string | null;
}

export default function TicketSummaryCard({ summary }: TicketSummaryCardProps) {
    if (!summary) return null;

    // The summary comes in format:
    // Issue: <text>\n\nLatest Update: <text>\n\nStatus: <text>
    const parts = summary.split('\n\n');
    let issue = '';
    let latestUpdate = '';
    let status = '';

    parts.forEach(part => {
        if (part.startsWith('Issue: ')) issue = part.replace('Issue: ', '');
        else if (part.startsWith('Latest Update: ')) latestUpdate = part.replace('Latest Update: ', '');
        else if (part.startsWith('Status: ')) status = part.replace('Status: ', '');
    });

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 shadow-sm overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles className="w-24 h-24 text-indigo-500" />
            </div>

            <div className="px-6 py-4 border-b border-indigo-100/50 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-extrabold tracking-tight text-indigo-900">AI Ticket Summary</h3>
            </div>

            <div className="p-6 relative z-10 space-y-5">
                {issue && (
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
                            Initial Issue
                        </p>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed bg-white/60 p-3 rounded-xl border border-indigo-100/50">
                            {issue}
                        </p>
                    </div>
                )}

                {latestUpdate && (
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 mb-1 flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5" /> Latest Activity
                        </p>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed bg-white/60 p-3 rounded-xl border border-indigo-100/50">
                            {latestUpdate}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
