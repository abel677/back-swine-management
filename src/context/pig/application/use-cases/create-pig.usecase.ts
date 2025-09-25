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
import { GetProductByIdUseCase } from '../../../product/application/use-cases/get-product-by-id.usecase';
import { GetProductByNameUseCase } from '../../../product/application/use-cases/get-product-by-name.usecase';
import { CreateProductUseCase } from '../../../product/application/use-cases/create-product.usecase';
import { GetCategoryByIdUseCase } from '../../../category/application/use-cases/get-category-by-id.usecase';
import { GetCategoryByNameUseCase } from '../../../category/application/use-cases/get-category-by-name.usecase';
import { CreateCategoryUseCase } from '../../../category/application/use-cases/create-category.usecase';
import { PigProduct } from '../../domain/entities/pig-product.entity';
import { Category } from '../../../category/domain/entities/category.entity';

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
    // producto
    @inject('GetProductByIdUseCase')
    private readonly getProductByIdUseCase: GetProductByIdUseCase,

    @inject('GetProductByNameUseCase')
    private readonly getProductByNameUseCase: GetProductByNameUseCase,

    @inject('CreateProductUseCase')
    private readonly createProductUseCase: CreateProductUseCase,

    // categoria
    @inject('GetCategoryByIdUseCase')
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    @inject('GetCategoryByNameUseCase')
    private readonly getCategoryByNameUseCase: GetCategoryByNameUseCase,
    @inject('CreateCategoryUseCase')
    private readonly createCategoryUseCase: CreateCategoryUseCase,
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

    if (dto.pigProduct) {
      for (const pigProd of dto.pigProduct) {
        let product = undefined;

        // verificar si vienen un producto
        if (pigProd.product) {
          // verificar si ya existe mediante el id
          if (pigProd.product.id) {
            // obtener el producto por el lid
            product = await this.getProductByIdUseCase.execute(
              pigProd.product.id,
              newPig.farm.id,
            );
          } else {
            // obtener mediante el nombre, en por si ya se ha sincronizado
            product = await this.getProductByNameUseCase.execute(
              pigProd.product.name,
              newPig.farm.id,
            );

            // obtener la categoría
            let category: Category | null = null;

            // verificar si viene una categoría
            if (pigProd.product.category) {
              // verificar si ya existe por el id
              if (pigProd.product.category.id) {
                // obtener la categoría por el id
                category = await this.getCategoryByIdUseCase.execute(
                  pigProd.product.category.id,
                  newPig.farm.id,
                );
              } else {
                // obtener por el nombre por si ya se ha sincronizado
                category = await this.getCategoryByNameUseCase.execute(
                  pigProd.product.category.name,
                  newPig.farm.id,
                );
                // si no se obtiene por id | name no existe se crea una nueva categoria
                if (!category) {
                  category = await this.createCategoryUseCase.execute(userId, {
                    farmId: newPig.farm.id,
                    name: pigProd.product.category.name,
                  });
                }
              }
            }

            if (!category) {
              throw Application.notFound(
                'Categoría de producto no encontrada.',
              );
            }

            if (!product) {
              product = await this.createProductUseCase.execute(userId, {
                farmId: newPig.farm.id,
                category: {
                  id: category.id,
                  name: category.name,
                },
                name: pigProd.product.name,
                price: pigProd.product.price,
                unitMeasurement: pigProd.product.unitMeasurement,
              });
            }
          }
          if (!product) throw Application.notFound('Producto no encontrado.');

          // Actualizar o agregar PigProduct al cerdo
          const ppFind = newPig.pigProduct.find((p) => p.id === pigProd.id);

          if (ppFind) {
            const previousPrice = ppFind.price;
            if (product) ppFind.saveProduct(product);
            if (pigProd.quantity) ppFind.saveQuantity(pigProd.quantity);
            if (pigProd.price) ppFind.savePrice(pigProd.price);
            if (pigProd.date) ppFind.saveDate(new Date(pigProd.date));
            newPig.savePigProduct(ppFind, previousPrice);
          } else {
            newPig.savePigProduct(
              PigProduct.create({
                pigId: newPig.id,
                price: pigProd.price!,
                product: product,
                quantity: pigProd.quantity!,
                date: new Date(pigProd.date!),
              }),
            );
          }
        }
      }
    }

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
                  earTag: `${newPig.earTag}-${crypto.randomUUID().slice(0, 6)}`,
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
