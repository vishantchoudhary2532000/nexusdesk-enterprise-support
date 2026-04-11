import TeamMembers from '../../../components/TeamMembers';

export const metadata = {
    title: 'Team Directory | NexusDesk',
    description: 'Manage your organization members and roles.',
};

export default function TeamPage() {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Team Management</h2>
                <p className="text-slate-500 mt-1">View, invite, and manage access for your organization members.</p>
            </div>

            <div className="max-w-4xl">
                <TeamMembers />
            </div>
        </div>
    );
}
