import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport'; // ✅ Importar tipo

import { IMessage, MailService } from '../../domain/ports/mail-service.port';
import { envConfig } from '../../../../config/envConfig';

const { MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD } = envConfig;

export class MailtrapService implements MailService {
  private transporter: Mail;

  constructor() {
    const transportOptions: SMTPTransport.Options = {
      host: MAIL_HOST,
      port: Number(MAIL_PORT),
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    };

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async send(message: IMessage): Promise<void> {
    await this.transporter.sendMail({
      to: {
        name: message.to.name,
        address: message.to.email,
      },
      from: {
        name: message.from.name,
        address: message.from.email,
      },
      subject: message.subject,
      html: message.body,
    });
  }
}
