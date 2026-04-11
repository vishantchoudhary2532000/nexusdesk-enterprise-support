/**
 * This service currently simulates sending emails by logging them to the console.
 * It is fully designed to plug into Resend, SendGrid, or AWS SES when you add billing/API keys.
 */

type EmailPayload = {
    to: string;
    subject: string;
    html: string;
};

export const sendEmail = async ({ to, subject, html }: EmailPayload) => {
    // In production with Resend, you would do:
    // await resend.emails.send({ from: 'hello@nexusdesk.app', to, subject, html });
    
    console.log('--- 📨 DISPATCHING EMAIL 📨 ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body HTML:\n${html}`);
    console.log('------------------------------');

    // Simulate network delay
    return new Promise(resolve => setTimeout(resolve, 500));
};

export const templates = {
    TicketCreatedEmail: (recipientName: string, ticketTitle: string, ticketId: string) => ({
        subject: `Ticket Received: ${ticketTitle}`,
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2>Hi ${recipientName},</h2>
                <p>We've successfully received your ticket: <strong>${ticketTitle}</strong>.</p>
                <p>Our team is reviewing it and will get back to you shortly.</p>
                <a href="https://nexusdesk.demo.app/dashboard/tickets/${ticketId}" style="display: inline-block; padding: 10px 20px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px;">View Ticket</a>
            </div>
        `
    }),

    TicketReplyEmail: (recipientName: string, ticketTitle: string, ticketId: string, message: string) => ({
        subject: `New Reply: ${ticketTitle}`,
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2>Hi ${recipientName},</h2>
                <p>There is a new update on your ticket <strong>${ticketTitle}</strong>:</p>
                <blockquote style="border-left: 4px solid #7c3aed; padding-left: 15px; margin-left: 0; color: #555;">
                    ${message}
                </blockquote>
                <a href="https://nexusdesk.demo.app/dashboard/tickets/${ticketId}" style="display: inline-block; padding: 10px 20px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Reply to Ticket</a>
            </div>
        `
    }),

    TeamInviteEmail: (inviterEmail: string, orgName: string, magicLink: string) => ({
        subject: `You've been invited to join ${orgName}`,
        html: `
            <div style="font-family: sans-serif; color: #333;">
                <h2>Welcome to NexusDesk!</h2>
                <p><strong>${inviterEmail}</strong> has invited you to collaborate with them on the <strong>${orgName}</strong> workspace.</p>
                <p>Click the link below to accept the invitation and set up your account.</p>
                <a href="${magicLink}" style="display: inline-block; padding: 10px 20px; background-color: #7c3aed; color: #fff; text-decoration: none; border-radius: 5px; margin-top: 15px;">Accept Invitation</a>
            </div>
        `
    })
};
