import { inject, injectable } from 'tsyringe';
import { PigRepository } from '../../domain/ports/pig.repository';
import { CreatePigDto } from '../dtos/create-pig.dto';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { Application } from '../../../../utils/http-error';
import { GetBreedByIdUseCase } from '../../../breed/application/use-cases/get-breed-by-id.usecase';
import { Gender, Pig, Type } from '../../domain/entities/pig.entity';
import { GetPhaseByIdUseCase } from '../../../farm/application/use-cases/phases/get-phase-by-id.usecase';
import { ReproductiveCycle } from '../../domain/entities/reproductive-cycle.entity';
import { PigReproductiveCalculatorUseCase } from './pig-reproductive-calculator.usecase';
import {
  PigPhase,
  PigReproductiveStage,
  PigSex,
  PigType,
} from '../../../../utils/pig.enum';
import { Birth } from '../../domain/entities/birth.entity';
import { GetBreedByNameUseCase } from '../../../breed/application/use-cases/get-breed-by-name.usecase';
import { CreateBreedUseCase } from '../../../breed/application/use-cases/create-breed.usecase';
import { GetPhaseByNameUseCase } from '../../../farm/application/use-cases/phases/get-phase-by-name.usecase';
import { Regex } from '../../../../utils/regex';
import { PigMapper } from '../../infrastructure/mappers/pig.mapper';
import { GetSettingByFarmIdUseCase } from '../../../farm/application/use-cases/settings/get-settings-by-farm-id.usecase';
import { GetReproductiveStageByIdUseCase } from '../../../farm/application/use-cases/reproductive-stage/get-reproductive-by-id.usecase';
import { CreateSowNotificationsUseCase } from '../../../notifications/application/use-cases/create-sow-notification.usecase';
import { DeleteSowNotificationUseCase } from '../../../notifications/application/use-cases/delete-sow-notification.usecase';

@injectable()
export class CreatePigUseCase {
  constructor(
    @inject('PigRepository')
    private readonly pigRepository: PigRepository,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
    @inject('GetBreedByIdUseCase')
    private readonly getBreedByIdUseCase: GetBreedByIdUseCase,
    @inject('GetPhaseByIdUseCase')
    private readonly getPhaseByIdUseCase: GetPhaseByIdUseCase,
    @inject('GetSettingByFarmIdUseCase')
    private readonly getSettingByFarmIdUseCase: GetSettingByFarmIdUseCase,
    @inject('PigReproductiveCalculatorUseCase')
    private readonly pigCalculatorUseCase: PigReproductiveCalculatorUseCase,
    @inject('GetReproductiveStageByIdUseCase')
    private readonly getReproductiveStageByIdUseCase: GetReproductiveStageByIdUseCase,
    @inject('GetBreedByNameUseCase')
    private readonly getBreedByNameUseCase: GetBreedByNameUseCase,
    @inject('CreateBreedUseCase')
    private readonly createBreedUseCase: CreateBreedUseCase,
    @inject('GetPhaseByNameUseCase')
    private readonly getPhaseByNameUseCase: GetPhaseByNameUseCase,
    @inject('CreateSowNotificationsUseCase')
    private readonly createSowNotificationUseCase: CreateSowNotificationsUseCase,
    @inject('DeleteSowNotificationUseCase')
    private readonly deleteSowNotificationUseCase: DeleteSowNotificationUseCase,
  ) {}

  async execute(userId: string, dto: CreatePigDto) {
    // verificar si existe la granja
    const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
    if (!farm) throw Application.notFound('Granja de usuario no encontrada');

    // verificar si existe la raza en la granja del usuario
    const breed = await this.getBreedByIdUseCase.execute(
      dto.breedId,
      dto.farmId,
    );
    if (!breed) {
      throw Application.notFound('Raza no encontrada en granja del usuario.');
    }

    // verificar si existe la fase en la granja del usuario
    const phase = await this.getPhaseByIdUseCase.execute({
      id: dto.phaseId,
      farmId: dto.farmId,
    });
    if (!phase) {
      throw Application.notFound('Fase no encontrada en granja del usuario.');
    }

    // verificar si ya existe un cerdo con un mismo earTag
    const pig = await this.pigRepository.getByEarTag(dto.earTag, dto.farmId);
    if (pig) {
      throw Application.badRequest(
        'Ya existe un cerdo con el mismo número etiqueta.',
      );
    }

    // crear datos generales de un cerdo
    const newPig = Pig.create({
      farm: farm,
      breed: breed,
      phase: phase,
      earTag: dto.earTag,
      birthDate: new Date(dto.birthDate),
      gender: dto.gender as Gender,
      initialPrice: dto.initialPrice,
      motherId: dto.motherId,
      type: dto.type as Type,
      fatherId: dto.fatherId,
    });

    // verificar si es un reproductora
    if (newPig.isSow()) {
      // verificar si hay un ciclo reproductivo
      if (dto.sowReproductiveCycle && dto.sowReproductiveCycle.length > 0) {
        // verificar si la cerda está acta para asignar un estado reproductivo
        const setting = await this.getSettingByFarmIdUseCase.execute(
          dto.farmId,
        );
        if (!setting) throw Application.internal('Comunicar con soporte.');

        if (newPig.getAge() < setting.minimumBreedingAgeInDays) {
          throw Application.badRequest('Edad de cerda no permitida.');
        }

        for (const cycle of dto.sowReproductiveCycle) {
          // verificar si existe la etapa reproductiva
          const nexStage = await this.getReproductiveStageByIdUseCase.execute({
            farmId: dto.farmId,
            id: cycle.reproductiveStageId,
          });
          if (!nexStage) {
            throw Application.notFound('Etapa reproductiva no encontrada.');
          }
          const stage = nexStage.name as PigReproductiveStage;

          // verificar si hay un reproductor y si existe en la granja del usuario
          let boar: Pig | null = null;
          if (this.requiereBoar(stage)) {
            if (cycle.boarId) {
              boar = await this.pigRepository.getById(cycle.boarId, farm.id);
              if (!boar) {
                throw Application.notFound('Cerdo reproductor no encontrado.');
              }

              if (!boar.boarCanReproduce()) {
                throw Application.badRequest(
                  'Cerdo reproductor no cumple con edad o fase permitida.',
                );
              }
            }
          }
          // calcular y obtener la fecha final de la etapa reproductiva
          const startDate = new Date(cycle.startDate);
          const { endDate } = await this.pigCalculatorUseCase.execute(
            userId,
            stage,
            startDate,
          );

          // crear registro historial del ciclo reproductivo en su etapa
          const newCycle = ReproductiveCycle.create({
            startDate: startDate,
            endDate: endDate,
            reproductiveStage: nexStage,
            sowId: newPig.id,
            boarId: cycle.boarId,
          });

          const isLactation = nexStage.name === PigReproductiveStage.Lactation;

          // si la etapa es lactancia
          if (isLactation) {
            this.validateBirthData(cycle.birth);
            const birth = Birth.create({
              cycleId: newCycle.id,
              date: startDate,
              liveMales: cycle.birth!.liveMales,
              liveFemales: cycle.birth!.liveFemales,
              totalDead: cycle.birth!.totalDead,
              avgWeight: cycle.birth!.avgWeight,
              description: cycle.birth!.description,
            });
            newCycle.saveBirth(birth);

            // obtener la raza de los lechones
            const sowBreedName = newPig.breed.name;
            const boarBreedName = boar?.breed.name;
            const isSameBreed = boarBreedName === sowBreedName;
            const pigletBreedName =
              boarBreedName && !isSameBreed
                ? `${sowBreedName} x ${boarBreedName}`
                : sowBreedName;

            // verificar si existe la raza cruse
            let pigletBreed = await this.getBreedByNameUseCase.execute({
              name: pigletBreedName,
              farmId: farm.id,
            });
            if (!pigletBreed) {
              pigletBreed = await this.createBreedUseCase.execute(userId, {
                name: pigletBreedName,
                farmId: farm.id,
              });
            }
            const phasePiglet = await this.getPhaseByNameUseCase.execute({
              name: PigPhase.Neonatal,
              farmId: farm.id,
            });
            // crear registros para los lechones
            const pigletsConfig = [
              {
                count: cycle.birth!.liveFemales,
                sex: PigSex.Female,
              },
              {
                count: cycle.birth!.liveMales,
                sex: PigSex.Male,
              },
            ];
            pigletsConfig.forEach(({ count, sex }) => {
              for (let i = 0; i < count; i++) {
                const piglet = Pig.create({
                  farm: newPig.farm,
                  breed: pigletBreed!,
                  phase: phasePiglet!,
                  earTag: `P${sex === PigSex.Female ? 'H' : 'M'}P-${crypto
                    .randomUUID()
                    .slice(0, 4)}`,
                  birthDate: new Date(),
                  initialPrice: setting.initialPigletPrice,
                  type: PigType.Production,
                  gender: sex,
                  birthId: birth.id,
                  fatherId: boar ? boar.id : undefined,
                  motherId: newPig.id,
                });

                birth.savePiglet(piglet);
              }
            });
          }

          newPig.saveSowReproductiveCycle(newCycle);
          // eliminar alertas anteriores
          await this.deleteSowNotificationUseCase.execute({
            userId: userId,
            earTag: newPig.earTag,
          });
          // crear nuevas notificaciones para el estado reproductivo
          await this.createSowNotificationUseCase.execute({
            userId: userId,
            earTag: newPig.earTag,
            reproductiveStage: stage,
            startDate: newCycle.startDate,
          });
        }
      }
    }
    await this.pigRepository.save(newPig);
    return PigMapper.toHttpResponse(newPig);
  }

  private validateBirthData(birth?: {
    date: string;
    liveMales: number;
    liveFemales: number;
    totalDead: number;
    avgWeight: number;
    description?: string;
  }) {
    if (!birth) {
      throw Application.badRequest(`birth: Datos del parto requeridos.`);
    }
    const { date, liveMales, liveFemales, totalDead, avgWeight } = birth;

    if (!Regex.isoDate.test(date)) {
      throw Application.badRequest(`birth.date: Fecha inválida.`);
    }

    if (typeof liveMales !== 'number' || liveMales < 0) {
      throw Application.badRequest(
        `birth.liveMales: Número lechones machos inválido.`,
      );
    }

    if (typeof liveFemales !== 'number' || liveFemales < 0) {
      throw Application.badRequest(
        `birth.liveFemales: Número lechones hembras inválido.`,
      );
    }

    if (typeof totalDead !== 'number' || totalDead < 0) {
      throw Application.badRequest(
        `birth.totalDead: Número total vivos inválido.`,
      );
    }

    if (typeof avgWeight !== 'number' || avgWeight < 0) {
      throw Application.badRequest(`birth.avgWeight: Peso inválido.`);
    }
  }

  private requiereBoar = (state: PigReproductiveStage): boolean => {
    return [
      PigReproductiveStage.Insemination,
      PigReproductiveStage.Gestation,
      PigReproductiveStage.Lactation,
    ].includes(state);
  };
}
