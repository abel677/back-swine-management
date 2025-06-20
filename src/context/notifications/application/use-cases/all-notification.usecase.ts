import { inject, injectable } from 'tsyringe';
import { NotificationRepository } from '../../domain/ports/notification.repository';

@injectable()
export class AllNotificationUseCase {
  constructor(
    @inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(userId: string) {
    return await this.notificationRepository.findAllSent(userId);
  }
}
