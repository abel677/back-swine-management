import { Prisma } from '@prisma/client';
import { Notification } from '../domain/entities/notification.entity';

export class NotificationMapper {
  static toHttpResponse(notification: Notification) {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      sentAt: notification.sentAt,
      eventType: notification.eventType,
      userId: notification.userId,
    };
  }

  static toDomain(
    notification: Prisma.NotificationGetPayload<{}>,
  ): Notification {
    return Notification.fromPersistence({
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      metadata: notification.metadata?.toString() || '',
      createdAt: notification.createdAt,
      sentAt: notification.sentAt,
      eventType: notification.eventType,
    });
  }

  static toCreatePersistence(
    notification: Notification,
  ): Prisma.NotificationCreateInput {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      read: notification.read,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      sentAt: notification.sentAt,
      eventType: notification.eventType,
      user: {
        connect: {
          id: notification.userId,
        },
      },
    };
  }

  static toUpdatePersistence(
    notification: Notification,
  ): Prisma.NotificationCreateInput {
    return {
      title: notification.title,
      message: notification.message,
      read: notification.read,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      sentAt: notification.sentAt,
      eventType: notification.eventType,
      user: {
        connect: {
          id: notification.userId,
        },
      },
    };
  }
}
