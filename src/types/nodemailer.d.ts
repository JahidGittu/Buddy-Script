// types/nodemailer.d.ts
declare module 'nodemailer' {
  export interface Transporter {
    sendMail(mailOptions: any): Promise<any>;
    verify(callback: (error: Error | null, success: boolean) => void): void;
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
  }

  export function createTransporter(config: TransportOptions): Transporter;
  export function createTransport(config: TransportOptions): Transporter;
}