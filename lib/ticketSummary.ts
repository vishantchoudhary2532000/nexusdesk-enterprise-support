export function generateTicketSummary(messages: any[], status: string): string {
    if (!messages || messages.length === 0) {
        return `Status: ${status}\nNo conversation history available.`;
    }

    // Sort messages by creation date if they aren't already
    const sortedMessages = [...messages].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const firstMessage = sortedMessages[0].message;
    const lastMessage = sortedMessages[sortedMessages.length - 1].message;

    // Helper to truncate text nicely
    const truncate = (text: string, maxLength: number = 80) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const initialProblem = truncate(firstMessage);
    const latestUpdate = sortedMessages.length > 1 ? truncate(lastMessage) : 'Awaiting response.';

    return `Issue: ${initialProblem}\n\nLatest Update: ${latestUpdate}\n\nStatus: ${status.charAt(0).toUpperCase() + status.slice(1)}`;
}
