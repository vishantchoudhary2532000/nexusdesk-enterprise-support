/**
 * SLA Health Status Utility
 * Calculates the threat level of a ticket transmission based on its deadline.
 */

export type SLAHealth = 'nominal' | 'approaching' | 'breached';

interface SLAStatus {
    health: SLAHealth;
    remainingMinutes: number;
    label: string;
}

export function getSLAStatus(deadlineStr: string | null): SLAStatus {
    if (!deadlineStr) {
        return { health: 'nominal', remainingMinutes: 9999, label: 'No Deadline' };
    }

    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins <= 0) {
        return { health: 'breached', remainingMinutes: diffMins, label: 'SLA VIOLATION' };
    }

    if (diffMins <= 60) {
        return { health: 'approaching', remainingMinutes: diffMins, label: 'BREACH IMMINENT' };
    }

    return { health: 'nominal', remainingMinutes: diffMins, label: 'NOMINAL FEED' };
}

export function formatRemainingTime(minutes: number): string {
    if (minutes <= 0) return '00:00:00';
    
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
}
