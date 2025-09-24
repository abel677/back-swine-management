import 'reflect-metadata';
import cron from 'node-cron';

import app from './app';
import { envConfig } from './config/envConfig';
import { Database } from './config/database';
import { configureContainer } from './config/container';
import { container } from 'tsyringe';
import { SendDailyNotificationsUseCase } from './context/notifications/application/use-cases/send-daily-notification.usecase';

(async () => {
  try {
    await Database.connect();
    console.log('✅ Base de datos conectada');

    const prisma = Database.getClient();
    configureContainer(prisma);

    app.listen(envConfig.PORT, '0.0.0.0', () => {
      console.log(`🚀 API corriendo en puerto: ${envConfig.PORT}`);

      // A las 08:00
      cron.schedule('0 8 * * *', async () => {
        const sendNotifications = container.resolve(
          SendDailyNotificationsUseCase,
        );
        await sendNotifications.execute();
      });
    });
  } catch (err) {
    console.error(`❌ Error al conectar con la DB: ${err}`);
    process.exit(1);
  }
})();
