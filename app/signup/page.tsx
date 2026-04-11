import SignupForm from '../../components/SignupForm';
import { Hexagon } from 'lucide-react';

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-[#0b0f19] flex flex-col justify-center relative overflow-hidden px-4 font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Geometric Accents */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-emerald-500/5 rotate-12 pointer-events-none hidden lg:block" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-indigo-500/5 -rotate-45 pointer-events-none hidden lg:block" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <SignupForm />
            </div>

            {/* Neural Link Info Footer */}
            <div className="fixed bottom-8 left-0 right-0 text-center opacity-20 pointer-events-none">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Integrated Secure Access Node</p>
            </div>
        </div>
    );
}
