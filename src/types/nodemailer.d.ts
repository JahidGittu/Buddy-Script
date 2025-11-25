// types/nodemailer.d.ts
declare module 'nodemailer' {
  export interface SendMailOptions {
    from?: string;
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    cc?: string | string[];
    bcc?: string | string[];
    replyTo?: string;
    inReplyTo?: string;
    references?: string | string[];
    headers?: Record<string, string>;
    attachments?: Array<{
      filename?: string;
      content?: string | Buffer;
      path?: string;
      contentType?: string;
      encoding?: string;
    }>;
  }

  export interface SentMessageInfo {
    messageId: string;
    envelope: {
      from: string;
      to: string[];
    };
    accepted: string[];
    rejected: string[];
    pending: string[];
    response: string;
  }

  export interface Transporter {
    sendMail(mailOptions: SendMailOptions): Promise<SentMessageInfo>;
    verify(callback: (error: Error | null, success: boolean) => void): void;
    verify(): Promise<boolean>;
  }

  export interface TransportOptions {
    service?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
    tls?: {
      rejectUnauthorized?: boolean;
    };
    debug?: boolean;
    logger?: boolean;
  }

  export function createTransporter(config: TransportOptions): Transporter;
  export function createTransport(config: TransportOptions): Transporter;
}