import { PrismaClient } from '@prisma/client';
import { NotificationRepository } from '../domain/ports/notification.repository';
import { NotificationMapper } from './notification.mapper';
import { Notification } from '../domain/entities/notification.entity';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(
    @inject('PrismaClient')
    private readonly prisma: PrismaClient,
  ) {}

  async delete(params: { userId: string; earTag: string }): Promise<void> {
    const result = await this.prisma.notification.deleteMany({
      where: {
        userId: params.userId,
        metadata: {
          contains: `"earTag":"${params.earTag}"`,
        },
      },
    });
  }

  async getById(userId: string, id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findFirst({
      where: {
        userId,
        id,
      },
    });
    if (!notification) return null;
    return NotificationMapper.toDomain(notification);
  }

  async findAllSent(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
        sentAt: {
          not: null,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications.map((notification) =>
      NotificationMapper.toDomain(notification),
    );
  }

  async findByDate(date: Date, read: boolean): Promise<Notification[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(23, 59, 59, 999);

    const dateRange = {
      start: startDate,
      end: endDate,
    };

    const notifications = await this.prisma.notification.findMany({
      where: {
        read: read,
        createdAt: {
          gte: dateRange.start,
          lt: dateRange.end,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return notifications.map(NotificationMapper.toDomain);
  }

  async getAll(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications.map((notification) =>
      NotificationMapper.toDomain(notification),
    );
  }

  async save(notification: Notification): Promise<void> {
    await this.prisma.notification.upsert({
      where: { id: notification.id },
      create: NotificationMapper.toCreatePersistence(notification),
      update: NotificationMapper.toUpdatePersistence(notification),
    });
  }
}
