import { inject, injectable } from 'tsyringe';
import { DeviceRepository } from '../../../device/domain/ports/device.repository';
import { Util } from '../../../../utils/utils';
import { NotificationRepository } from '../../domain/ports/notification.repository';
import { NotificationSender } from '../../domain/ports/notification-sender.port';
import { NotificationMapper } from '../../infrastructure/notification.mapper';

@injectable()
export class SendDailyNotificationsUseCase {
  constructor(
    @inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
    @inject('DeviceRepository')
    private readonly deviceRepository: DeviceRepository,
    @inject('NotificationSender')
    private readonly notificationSender: NotificationSender,
  ) {}

  async execute(): Promise<void> {
    const today = Util.now();

    const notifications = await this.notificationRepository.findByDate(
      today,
      false,
    );

    for (const notification of notifications) {
      const devices = await this.deviceRepository.getAll(notification.userId);
      const tokens = devices.map((d) => d.token).filter(Boolean);

      if (tokens.length > 0) {
        await this.notificationSender.sendToTokens({
          title: notification.title,
          body: notification.message,
          tokens,
          data: {
            notificationId: notification.id,
            notification: JSON.stringify(
              NotificationMapper.toHttpResponse(notification),
            ),
          },
        });
        notification.saveSentAt(Util.now());
        notification.saveRead(true);

        await this.notificationRepository.save(notification);
      }
    }
  }
}
