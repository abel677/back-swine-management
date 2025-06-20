import { inject, injectable } from 'tsyringe';
import { NotificationRepository } from '../../domain/ports/notification.repository';

@injectable()
export class DeleteSowNotificationUseCase {
  constructor(
    @inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(params: { userId: string; earTag: string }) {
    await this.notificationRepository.delete(params);
  }
}
