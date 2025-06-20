import { inject, injectable } from 'tsyringe';
import { NotificationRepository } from '../../domain/ports/notification.repository';
import { PigReproductiveCalculatorUseCase } from '../../../pig/application/use-cases/pig-reproductive-calculator.usecase';
import { PigReproductiveStage } from '../../../../utils/pig.enum';
import { Notification } from '../../domain/entities/notification.entity';
import { Util } from '../../../../utils/utils';

@injectable()
export class CreateSowNotificationsUseCase {
  constructor(
    @inject('NotificationRepository')
    private readonly notificationRepository: NotificationRepository,
    @inject('PigReproductiveCalculatorUseCase')
    private readonly pigCalculatorUseCase: PigReproductiveCalculatorUseCase,
  ) {}
  async execute(params: {
    userId: string;
    reproductiveStage: PigReproductiveStage;
    earTag: string;
    startDate: Date;
  }) {
    const reproductiveStage = params.reproductiveStage;
    const isGestation = reproductiveStage === PigReproductiveStage.Gestation;
    const isLactation = reproductiveStage === PigReproductiveStage.Lactation;

    const { keyDates } = await this.pigCalculatorUseCase.execute(
      params.userId,
      params.reproductiveStage,
      params.startDate,
    );

    // 1. crear notificaciones de eventos
    for (const data of keyDates) {
      const notification = Notification.create({
        userId: params.userId,
        title: `Alerta Reproductiva Cerda ${params.earTag}`,
        message: data.description,
        createdAt: data.date,
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });
      await this.notificationRepository.save(notification);
    }

    //2. crear notificaciones de vacunación
    if (isGestation) {
      const notification = Notification.create({
        userId: params.userId,
        title: `Alerta de vacunación - Cerda ${params.earTag}`,
        message: `Administrar la primera dosis de la vacuna bacterina-toxoide a la cerda ${params.earTag} en fecha ${params.startDate}. 
        La vacuna contiene toxoide de *Clostridium perfringens* tipo C y cepas enterotoxigénicas de *E. coli* (K88, K99, 987P y F41), químicamente inactivadas. 
        Requiere 2 dosis con 3 semanas de diferencia, aplicadas durante la segunda mitad de la gestación (entre los días 80 y 100). Conservar entre 2°C y 8°C.`,
        createdAt: Util.addDays(params.startDate, 80),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });
      await this.notificationRepository.save(notification);
    }
    if (isLactation) {
      const notification = Notification.create({
        userId: params.userId,
        title: `Alerta de vacunación - Cerda ${params.earTag}`,
        message: `Administrar 2 mL de FARROWSURE-GOLD-B por vía intramuscular a la cerda ${params.earTag} entre los días 2 y 5 postparto.
        Esta vacuna contiene:
        - Virus del Parvovirus Porcino (PPV)
        - Bacterina con *E. rhusiopathiae* (cepa CN3342)
        - Leptospiras: *L. bratislava*, *L. canicola*, *L. grippotyphosa*, *L. hardjo*, *L. icterohaemorrhagiae*, *L. pomona* (cepas especificadas).
        Agitar bien antes de aplicar. Esta revacunación debe realizarse en cada parto.`,
        createdAt: Util.addDays(params.startDate, 2),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay0 = Notification.create({
        userId: params.userId,
        title: `Manejo preparto - Cerda ${params.earTag}`,
        message: `Realizar limpieza y desinfección de la maternidad y de la cerda. 
                      Controlar alimentación progresiva postparto: Semana 1-2: 3 kg, Semana 3: 4 kg, Semana 4: 5 kg.`,
        createdAt: params.startDate,
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay1 = Notification.create({
        userId: params.userId,
        title: `Manejo Día 1 - Lechones de la cerda ${params.earTag}`,
        message: `Cortar colmillos y cola a los lechones.
                      Aplicar 1 ml de hierro y 1 ml de coccidiostato (Genzuril vía oral).
                      Cortar cordón, desinfectar con yodo, controlar peso (1.4-1.5 kg) y temperatura (30-32°C).`,
        createdAt: Util.addDays(params.startDate, 1),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay2 = Notification.create({
        userId: params.userId,
        title: `Manejo Día 2 - Lechones y madre ${params.earTag}`,
        message: `Aplicar 2 ml de Farrowsure a la madre.`,
        createdAt: Util.addDays(params.startDate, 2),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay3 = Notification.create({
        userId: params.userId,
        title: `Manejo Día 3 - Lechones de la cerda ${params.earTag}`,
        message: `Aplicar segunda dosis de hierro (2 ml) a los lechones.`,
        createdAt: Util.addDays(params.startDate, 3),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay8 = Notification.create({
        userId: params.userId,
        title: `Vacunación Día 8 - Lechones de la cerda ${params.earTag}`,
        message: `Aplicar 2 ml de Neumopig. Control de peso (3.1 kg). 
                      Iniciar adaptación con papilla de alimento pre-destete.`,
        createdAt: Util.addDays(params.startDate, 8),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay16 = Notification.create({
        userId: params.userId,
        title: `Vacunación Día 16 - Lechones y madre ${params.earTag}`,
        message: `Revacunar con Neumopig (2 ml), 
                      controlar peso (4.8 kg), desparasitar con doramectina: 0.4 ml a lechones, 4 ml a la madre.`,
        createdAt: Util.addDays(params.startDate, 16),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay25 = Notification.create({
        userId: params.userId,
        title: `Vacunación Día 25 - Lechones y madre ${params.earTag}`,
        message: `Aplicar CerdoBac: 3 ml en lechones y 5 ml en la madre.`,
        createdAt: Util.addDays(params.startDate, 25),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay35 = Notification.create({
        userId: params.userId,
        title: `Destete y vacunación Día 30 - Lechones ${params.earTag}`,
        message: `Aplicar 1 ml de cefalosporina (Cefacherry), realizar destete y controlar peso final (9.2 kg).`,
        createdAt: Util.addDays(params.startDate, 30),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      const notificationDay45 = Notification.create({
        userId: params.userId,
        title: `Vacunación PPC - Lechones de la cerda ${params.earTag}`,
        message: `Aplicar vacuna contra PPC entre los días 40 y 45. Coordinar con el veterinario para definir la fecha exacta.`,
        createdAt: Util.addDays(params.startDate, 42),
        metadata: JSON.stringify({ earTag: params.earTag }),
        eventType: 'ALERTA',
      });

      await this.notificationRepository.save(notification);
      await this.notificationRepository.save(notificationDay0);
      await this.notificationRepository.save(notificationDay1);
      await this.notificationRepository.save(notificationDay2);
      await this.notificationRepository.save(notificationDay3);
      await this.notificationRepository.save(notificationDay8);
      await this.notificationRepository.save(notificationDay16);
      await this.notificationRepository.save(notificationDay25);
      await this.notificationRepository.save(notificationDay35);
      await this.notificationRepository.save(notificationDay45);
    }
  }
}
