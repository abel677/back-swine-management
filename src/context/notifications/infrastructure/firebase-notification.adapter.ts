import { injectable } from 'tsyringe';
import admin from '../../../config/firebase';
import { NotificationSender } from '../domain/ports/notification-sender.port';

@injectable()
export class FirebaseNotificationAdapter implements NotificationSender {
  async sendToTokens({
    title,
    body,
    tokens,
    data = {},
  }: {
    title: string;
    body: string;
    tokens: string[];
    data?: any;
  }): Promise<void> {
    if (tokens.length === 0) return;

    await admin.messaging().sendEachForMulticast({
      notification: { title, body },
      tokens,
      data,
    });
  }
}
