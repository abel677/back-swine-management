import { inject, injectable } from 'tsyringe';
import { NotificationRepository } from '../../domain/ports/notification.repository';
import { Notification } from '../../domain/entities/notification.entity';
import { CreateNotificationDto } from '../dtos/create-notification.dto';

@injectable()
export class CreateNotificationUseCase {
  constructor(
    @inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, dto: CreateNotificationDto) {
    const notification = Notification.create({
      title: dto.title,
      message: dto.message,
      createdAt: dto.createdAt,
      eventType: dto.eventType,
      userId: userId,
      metadata: '',
    });
    await this.notificationRepository.save(notification);

    return notification;
  }
}
