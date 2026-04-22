import Skeleton from '../../components/ui/Skeleton';

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#0b0f19] p-8 space-y-12">
            <header className="flex justify-between items-end">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-96 rounded-2xl" />
                </div>
                <Skeleton className="h-14 w-48 rounded-2xl" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-8 bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] space-y-6">
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 bg-white/[0.01] border border-white/[0.03] rounded-[3rem] space-y-8">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-48" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-24 rounded-xl" />
                                <Skeleton className="h-10 w-24 rounded-xl" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                     <div className="p-8 bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] space-y-6">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-2 w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}
