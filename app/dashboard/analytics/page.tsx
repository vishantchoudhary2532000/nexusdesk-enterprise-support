import AnalyticsCards from '../../../components/AnalyticsCards';
import { BarChart3 } from 'lucide-react';

export const metadata = {
    title: 'Analytics | NexusDesk',
    description: 'System analytics and insights.',
};

export default function AnalyticsPage() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <div className="bg-violet-100 p-2 rounded-xl text-violet-700">
                        <BarChart3 className="w-6 h-6" />
                    </div>
                    Analytics Dashboard
                </h2>
                <p className="text-slate-500 mt-2">Realtime system metrics optimized for performance.</p>
            </div>

            <div className="max-w-6xl">
                <AnalyticsCards />
            </div>

            <div className="mt-12 bg-slate-50 border border-slate-200 rounded-2xl p-8 max-w-6xl text-center">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <BarChart3 className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">More Insights Coming Soon</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                    We are working on advanced resolution time tracking, agent performance metrics, and detailed historical reports. Upgrade to the Pro Plan to ensure you get immediate access when they launch.
                </p>
                <button className="mt-6 px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer shadow-md">
                    Upgrade to Pro
                </button>
            </div>
        </div>
    );
}
