import { GetCategoryByNameUseCase } from './../../../category/application/use-cases/get-category-by-name.usecase';
import { inject, injectable } from 'tsyringe';
import { PigRepository } from '../../domain/ports/pig.repository';
import { UpdatePigDto } from '../dtos/update-pig.dto';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { GetBreedByIdUseCase } from '../../../breed/application/use-cases/get-breed-by-id.usecase';
import { GetPhaseByIdUseCase } from '../../../farm/application/use-cases/phases/get-phase-by-id.usecase';
import { GetSettingByFarmIdUseCase } from '../../../farm/application/use-cases/settings/get-settings-by-farm-id.usecase';
import { PigReproductiveCalculatorUseCase } from './pig-reproductive-calculator.usecase';
import { GetReproductiveStageByIdUseCase } from '../../../farm/application/use-cases/reproductive-stage/get-reproductive-by-id.usecase';
import { GetBreedByNameUseCase } from '../../../breed/application/use-cases/get-breed-by-name.usecase';
import { CreateBreedUseCase } from '../../../breed/application/use-cases/create-breed.usecase';
import { GetPhaseByNameUseCase } from '../../../farm/application/use-cases/phases/get-phase-by-name.usecase';
import { Application } from '../../../../utils/http-error';
import {
  PigPhase,
  PigReproductiveStage,
  PigSex,
  PigState,
  PigType,
} from '../../../../utils/pig.enum';
import { Pig } from '../../domain/entities/pig.entity';
import { Regex } from '../../../../utils/regex';
import { ReproductiveCycle } from '../../domain/entities/reproductive-cycle.entity';
import { Birth } from '../../domain/entities/birth.entity';
import { CreateSowNotificationsUseCase } from '../../../notifications/application/use-cases/create-sow-notification.usecase';
import { DeleteSowNotificationUseCase } from '../../../notifications/application/use-cases/delete-sow-notification.usecase';
import { PigMapper } from '../../infrastructure/mappers/pig.mapper';
import { PigWeight } from '../../domain/entities/pig-weight';
import { GetProductByIdUseCase } from '../../../product/application/use-cases/get-product-by-id.usecase';
import { PigProduct } from '../../domain/entities/pig-product.entity';
import { GetCategoryByIdUseCase } from '../../../category/application/use-cases/get-category-by-id.usecase';
import { CreateProductUseCase } from '../../../product/application/use-cases/create-product.usecase';
import { CreateCategoryUseCase } from '../../../category/application/use-cases/create-category.usecase';
import { Category } from '../../../category/domain/entities/category.entity';
import { GetProductByNameUseCase } from '../../../product/application/use-cases/get-product-by-name.usecase';

@injectable()
export class UpdatePigUseCase {
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

  async execute(userId: string, id: string, dto: UpdatePigDto) {
    // verificar si ya existe un cerdo con un mismo earTag
    const pig = await this.pigRepository.getByIdAndUserId(id, userId);
    if (!pig) {
      throw Application.notFound('Cerdo del usuario no encontrado.');
    }

    // verificar si existe la granja
    if (dto.farmId) {
      const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
      if (!farm) throw Application.notFound('Granja de usuario no encontrada');
      pig.saveFarm(farm);
    }
    const farmId = pig.farm.id;

    // verificar si existe la raza en la granja del usuario
    if (dto.breedId) {
      const breed = await this.getBreedByIdUseCase.execute(dto.breedId, farmId);
      if (!breed) {
        throw Application.notFound('Raza no encontrada en granja del usuario.');
      }
      pig.saveBreed(breed);
    }

    // verificar si existe la fase en la granja del usuario
    if (dto.phaseId) {
      const phase = await this.getPhaseByIdUseCase.execute({
        id: dto.phaseId,
        farmId: farmId,
      });
      if (!phase) {
        throw Application.notFound('Fase no encontrada en granja del usuario.');
      }
      pig.savePhase(phase);
    }
    if (dto.type) {
      pig.saveType(dto.type as PigType);
    }
    // verificar si ya existe un cerdo con un mismo código
    if (dto.earTag && dto.earTag !== pig.earTag) {
      const existingPig = await this.pigRepository.getByEarTag(
        dto.earTag,
        farmId,
      );

      if (existingPig && existingPig.id !== pig.id) {
        throw Application.badRequest(
          'La etiqueta ingresada ya está en uso por otro cerdo en esta granja.',
        );
      }
      pig.saveEarTag(dto.earTag);
    }
    // otros campos
    if (dto.birthDate) {
      pig.saveBirthDate(new Date(dto.birthDate));
    }
    if (dto.initialPrice) {
      pig.saveInitialPrice(dto.initialPrice);
    }
    if (dto.state) {
      pig.saveState(dto.state as PigState);
    }

    if (dto.weights) {
      for (const pigWeight of dto.weights) {
        const pwFind = pig.weights.find((pw) => pw.id === pigWeight.id);
        if (pwFind) {
          if (pigWeight.days) pwFind.saveDays(pigWeight.days);
          if (pigWeight.weight) pwFind.saveWeight(pigWeight.weight);
          pig.saveWeight(pwFind);
        } else {
          const weight = PigWeight.create({
            days: pigWeight.days!,
            weight: pigWeight.weight!,
            pigId: pig.id,
          });
          pig.saveWeight(weight);
        }
      }
    }

    // actualizar productos
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
              pig.farm.id,
            );
          } else {
            // obtener la categoría
            let category: Category | null = null;

            // verificar si viene una categoría
            if (pigProd.product.category) {
              // verificar si ya existe por el id
              if (pigProd.product.category.id) {
                // obtener la categoría por el id
                category = await this.getCategoryByIdUseCase.execute(
                  pigProd.product.category.id,
                  pig.farm.id,
                );
              } else {
                // obtener por el nombre por si ya se ha sincronizado
                category = await this.getCategoryByNameUseCase.execute(
                  pigProd.product.category.name,
                  pig.farm.id,
                );
                // si no se obtiene por id | name no existe se crea una nueva categoria
                if (!category) {
                  category = await this.createCategoryUseCase.execute(userId, {
                    farmId: pig.farm.id,
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
            // obtener mediante el nombre, en por si ya se ha sincronizado
            product = await this.getProductByNameUseCase.execute(
              pigProd.product.name,
              pig.farm.id,
            );

            if (!product) {
              product = await this.createProductUseCase.execute(userId, {
                farmId: pig.farm.id,
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
          const ppFind = pig.pigProduct.find((p) => p.id === pigProd.id);

          if (ppFind) {
            const previousPrice = ppFind.price;
            if (product) ppFind.saveProduct(product);
            if (pigProd.quantity) ppFind.saveQuantity(pigProd.quantity);
            if (pigProd.price) ppFind.savePrice(pigProd.price);
            if (pigProd.date) ppFind.saveDate(new Date(pigProd.date));
            pig.savePigProduct(ppFind, previousPrice);
          } else {
            pig.savePigProduct(
              PigProduct.create({
                pigId: pig.id,
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

    // si es una reproductora
    if (pig.isSow()) {
      if (dto.sowReproductiveCycle && dto.sowReproductiveCycle.length > 0) {
        // verificar si la cerda está acta para asignar un estado reproductivo
        const setting = await this.getSettingByFarmIdUseCase.execute(farmId);
        if (!setting) throw Application.internal('Comunicar con soporte.');

        if (pig.getAge() < setting.minimumBreedingAgeInDays) {
          throw Application.badRequest('Edad de cerda no permitida.');
        }

        for (const cycle of dto.sowReproductiveCycle) {
          // verificar si existe la etapa reproductiva
          const nexStage = await this.getReproductiveStageByIdUseCase.execute({
            farmId: farmId,
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
              boar = await this.pigRepository.getById(cycle.boarId, farmId);
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
            sowId: pig.id,
            boarId: cycle.boarId,
          });

          const isLactation = stage === PigReproductiveStage.Lactation;

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

            // obtener última secuencia de parto
            const currentBirths = pig.sowReproductiveCycle
              .filter((sr) => sr.birth)
              .map((h) => h.birth);

            // Obtener el último parto
            const lastBirth = currentBirths[0];

            if (lastBirth) {
              birth.saveNumberBirth(lastBirth.numberBirth + 1);
            } else {
              // Si no hay partos previos
              birth.saveNumberBirth(1);
            }

            newCycle.saveBirth(birth);

            // obtener la raza de los lechones
            const sowBreedName = pig.breed.name;
            const boarBreedName = boar?.breed.name;
            const isSameBreed = boarBreedName === sowBreedName;
            const pigletBreedName =
              boarBreedName && !isSameBreed
                ? `${sowBreedName} x ${boarBreedName}`
                : sowBreedName;

            // verificar si existe la raza cruse
            let pigletBreed = await this.getBreedByNameUseCase.execute({
              name: pigletBreedName,
              farmId: farmId,
            });
            if (!pigletBreed) {
              pigletBreed = await this.createBreedUseCase.execute(userId, {
                name: pigletBreedName,
                farmId: farmId,
              });
            }
            const phasePiglet = await this.getPhaseByNameUseCase.execute({
              name: PigPhase.Neonatal,
              farmId: farmId,
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
                  farm: pig.farm,
                  breed: pigletBreed!,
                  phase: phasePiglet!,
                  earTag: `${pig.earTag}-${crypto.randomUUID().slice(0, 6)}`,
                  birthDate: new Date(),
                  initialPrice: setting.initialPigletPrice,
                  type: PigType.Production,
                  gender: sex,
                  birthId: birth.id,
                  fatherId: boar ? boar.id : undefined,
                  motherId: pig.id,
                });

                birth.savePiglet(piglet);
              }
            });
          }

          // estado reproductivo es Destete
          if (stage === PigReproductiveStage.Weaning) {
            // verificar si la cerda está con historial reproductivo = Lactancia
            const birth = pig.sowCurrentReproductiveCycle?.birth;
            if (!birth) {
              throw Application.badRequest(
                'La cerda no registra historial de parto.',
              );
            }

            // obtener la fase destete para asignar a los lechones a destetar
            const phasePiglet = await this.getPhaseByNameUseCase.execute({
              name: PigPhase.Weaning,
              farmId: farmId,
            });
            if (!phasePiglet) {
              throw Application.notFound('Fase no encontrada.');
            }

            pig.sowCurrentReproductiveCycle.birth.weanLitter(phasePiglet);
            pig.saveSowReproductiveCycle(pig.sowCurrentReproductiveCycle);
          }

          pig.saveSowReproductiveCycle(newCycle);

          // eliminar alertas anteriores
          await this.deleteSowNotificationUseCase.execute({
            userId: userId,
            earTag: pig.earTag,
          });
          // crear nuevas notificaciones para el estado reproductivo
          await this.createSowNotificationUseCase.execute({
            userId: userId,
            earTag: pig.earTag,
            reproductiveStage: stage,
            startDate: newCycle.startDate,
          });
        }
      }
    }
    await this.pigRepository.save(pig);
    return PigMapper.toHttpResponse(pig);
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
