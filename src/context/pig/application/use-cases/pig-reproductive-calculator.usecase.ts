import { inject, injectable } from 'tsyringe';
import { Application } from '../../../../utils/http-error';
import { PigReproductiveStage } from '../../../../utils/pig.enum';
import { Util } from '../../../../utils/utils';
import { SettingRepository } from '../../../farm/domain/ports/setting.repository';

interface ReproductiveTimeline {
  state: PigReproductiveStage;
  startDate: Date;
  endDate: Date;
  nextState: PigReproductiveStage;
  keyDates: {
    date: Date;
    description: string;
  }[];
}

@injectable()
export class PigReproductiveCalculatorUseCase {
  constructor(
    @inject('SettingRepository')
    private readonly settingRepository: SettingRepository,
  ) {}

  private calculateHeatDates(
    startDate: Date = new Date(),
    durationDays: number,
  ): ReproductiveTimeline {
    const endDate = Util.addDays(startDate, durationDays);
    return {
      state: PigReproductiveStage.Heat,
      startDate,
      endDate,
      nextState: PigReproductiveStage.Insemination,
      keyDates: [
        {
          date: Util.addDays(startDate, durationDays - (durationDays - 1)),
          description: 'Mejor momento para inseminación',
        },
        {
          date: Util.addDays(startDate, durationDays - 1),
          description: 'Fin de ventana fértil',
        },
      ],
    };
  }

  private calculateInseminationDates(
    startDate: Date,
    durationDays: number,
  ): ReproductiveTimeline {
    const endDate = Util.addDays(startDate, durationDays);
    return {
      state: PigReproductiveStage.Insemination,
      startDate,
      endDate,
      nextState: PigReproductiveStage.Gestation,
      keyDates: [
        {
          date: Util.addDays(startDate, durationDays),
          description: 'Ecografía de confirmación',
        },
      ],
    };
  }

  private calculateGestationDates(
    startDate: Date,
    durationDays: number,
  ): ReproductiveTimeline {
    const endDate = Util.addDays(startDate, durationDays);
    return {
      state: PigReproductiveStage.Gestation,
      startDate,
      endDate,
      nextState: PigReproductiveStage.Lactation,
      keyDates: [
        {
          date: Util.addDays(startDate, 30),
          description: 'Control de desarrollo fetal',
        },
        {
          date: Util.addDays(startDate, 90),
          description: 'Preparación parto',
        },
        {
          date: Util.addDays(endDate, -7),
          description: 'Última semana de gestación',
        },
        {
          date: Util.addDays(endDate, -3),
          description: 'Ventana estimada para el parto',
        },
      ],
    };
  }

  private calculateLactationDates(
    startDate: Date,
    durationDays: number,
  ): ReproductiveTimeline {
    const endDate = Util.addDays(startDate, durationDays);
    return {
      state: PigReproductiveStage.Lactation,
      startDate,
      endDate,
      nextState: PigReproductiveStage.Rest,
      keyDates: [
        {
          date: Util.addDays(startDate, 7),
          description: 'Primer control lechones',
        },
        {
          date: Util.addDays(startDate, 14),
          description: 'Inicio destete progresivo',
        },
      ],
    };
  }

  private calculateWeaningDates(startDate: Date): ReproductiveTimeline {
    const endDate = new Date();
    return {
      state: PigReproductiveStage.Weaning,
      startDate,
      endDate,
      nextState: PigReproductiveStage.Rest,
      keyDates: [],
    };
  }

  private calculateRestPeriod(
    startDate: Date,
    durationDays: number,
  ): ReproductiveTimeline {
    const endDate = Util.addDays(startDate, durationDays);
    return {
      state: PigReproductiveStage.Rest,
      startDate,
      endDate,
      nextState: PigReproductiveStage.Heat,
      keyDates: [
        {
          date: Util.addDays(startDate, durationDays - 2),
          description: 'Preparación próximo ciclo',
        },
      ],
    };
  }

  async execute(
    userId: string,
    state: PigReproductiveStage,
    startDate: Date,
  ): Promise<ReproductiveTimeline> {
    const setting = await this.settingRepository.getByUserId(userId);
    if (!setting) throw Application.internal('Comunicar con soporte x.');


    switch (state) {
      case PigReproductiveStage.Heat:
        return this.calculateHeatDates(
          startDate,
          setting.matingHeatDurationDays,
        );
      case PigReproductiveStage.Insemination:
        return this.calculateInseminationDates(
          startDate,
          setting.inseminationDurationDays,
        );
      case PigReproductiveStage.Gestation:
        return this.calculateGestationDates(
          startDate,
          setting.gestationDurationDays,
        );

      case PigReproductiveStage.Lactation:
        return this.calculateLactationDates(
          startDate,
          setting.lactationDurationDays,
        );
      case PigReproductiveStage.Weaning:
        return this.calculateWeaningDates(startDate);
      case PigReproductiveStage.Rest:
        return this.calculateRestPeriod(startDate, setting.restingDurationDays);
      default:
        throw new Error('Invalid reproductive state');
    }
  }
}
