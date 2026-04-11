import OnboardingWizard from '../../components/OnboardingWizard';
import { Hexagon } from 'lucide-react';

export default function OnboardingPage() {
    return (
        <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center relative overflow-hidden px-4 font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[120px] -z-10" />

            {/* Geometric Accents */}
            <div className="absolute top-20 right-[15%] w-64 h-64 border border-indigo-500/10 rounded-full rotate-12 -z-10" />
            <div className="absolute bottom-40 left-[10%] w-96 h-96 border border-violet-500/5 rounded-[3rem] -rotate-12 -z-10" />

            <div className="w-full max-w-lg mx-auto z-10 relative">
                <div className="flex flex-col items-center justify-center gap-2 mb-10 group cursor-default">
                    <div className="relative">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
                        <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-violet-600/20 rounded-2xl flex items-center justify-center border border-white/10 shadow-2xl">
                            <Hexagon className="w-8 h-8 text-indigo-400 fill-indigo-400/5" />
                        </div>
                    </div>
                </div>

                <OnboardingWizard />
            </div>
        </div>
    );
}
