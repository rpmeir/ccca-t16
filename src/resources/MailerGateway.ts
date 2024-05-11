
// Driven/Resource Port
export interface MailerGateway {
    send(recipient: string, subject: string, content: string): Promise<void>;
}

// Driven/Resource Adapter
export class MailerGatewayMemory implements MailerGateway {
    async send(recipient: string, subject: string, content: string): Promise<void> {
        console.log(`Sending email to ${recipient} with subject: ${subject} and content: ${content}`);
    }
}
