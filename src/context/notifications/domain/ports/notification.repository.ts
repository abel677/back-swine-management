import { Notification } from '../entities/notification.entity';

export interface NotificationRepository {
  delete(params: { userId: string; earTag: string }): Promise<void>;
  save(notification: Notification): Promise<void>;
  getAll(userId: string): Promise<Notification[]>;
  getById(userId: string, id: string): Promise<Notification | null>;
  findAllSent(userId: string): Promise<Notification[]>;
  findByDate(date: Date, read: boolean): Promise<Notification[]>;
}
