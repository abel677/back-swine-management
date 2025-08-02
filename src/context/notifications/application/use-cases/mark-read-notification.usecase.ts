import { inject, injectable } from 'tsyringe';
import { NotificationRepository } from '../../domain/ports/notification.repository';
import { Application } from '../../../../utils/http-error';
import { Notification } from '../../domain/entities/notification.entity';

@injectable()
export class MarkReadNotificationUseCase {
  constructor(
    @inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string, id: string): Promise<Notification> {
    const notification = await this.notificationRepository.getById(userId, id);
    if (!notification) {
      throw Application.notFound('Notificación no encontrada.');
    }
    notification.saveRead(true);
    await this.notificationRepository.save(notification);

    return notification;
  }
}
