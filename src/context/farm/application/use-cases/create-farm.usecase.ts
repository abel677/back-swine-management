import { inject, injectable } from 'tsyringe';
import { FarmRepository } from '../../domain/ports/farm.repository';
import { Farm } from '../../domain/entities/farm.entity';
import { UserRepository } from '../../../user/domain/ports/user-repository';
import { Application } from '../../../../utils/http-error';
import { ReproductiveStage } from '../../domain/entities/reproductive-stage.entity';
import { SettingRepository } from '../../domain/ports/setting.repository';
import { Setting } from '../../domain/entities/setting.entity';
import { Breed } from '../../../breed/domain/breed.entity';
import { BreedRepository } from '../../../breed/domain/ports/breed-repository.port';
import { PhaseRepository } from '../../domain/ports/phase.repository';
import { Phase } from '../../domain/entities/phase.entity';
import { Category } from '../../../category/domain/entities/category.entity';
import { CategoryRepository } from '../../../category/domain/ports/category.repository';

@injectable()
export class CreateFarmUseCase {
  constructor(
    @inject('FarmRepository') private readonly farmRepository: FarmRepository,
    @inject('UserRepository') private readonly userRepository: UserRepository,
    @inject('SettingRepository')
    private readonly settingRepository: SettingRepository,
    @inject('BreedRepository')
    private readonly breedRepository: BreedRepository,
    @inject('PhaseRepository')
    private readonly phaseRepository: PhaseRepository,
    @inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(dto: { name: string; ownerId: string }) {
    const owner = await this.userRepository.getById(dto.ownerId);
    if (!owner) throw Application.notFound('Usuario no disponible');

    const farm = Farm.create({
      name: dto.name,
      owner: owner,
    });
    await this.farmRepository.save(farm);

    const setting = Setting.create({
      farmId: farm.id,
      matingHeatDurationDays: 3, // Duración en días del estado de celo
      inseminationDurationDays: 21, // Duración en días del estado de inseminación
      gestationDurationDays: 114, // Duración en días del estado de gestación
      lactationDurationDays: 21, // Duración en días del estado de lactancia
      weaningDurationDays: 0, // Duración en días del estado de destete
      restingDurationDays: 7, // Duración en días del estado de descanso
      initialPigletPrice: 60, // Precio inicial de lechones
      minimumBreedingAgeInDays: 150, // Edad apta para iniciar un ciclo reproductivo
    });
    const reproductiveState = [
      ReproductiveStage.create({
        name: 'Celo',
        farmId: farm.id,
        order: 1,
      }),
      ReproductiveStage.create({
        name: 'Inseminación',
        farmId: farm.id,
        order: 2,
      }),
      ReproductiveStage.create({
        name: 'Gestación',
        farmId: farm.id,
        order: 3,
      }),
      ReproductiveStage.create({
        name: 'Lactancia',
        farmId: farm.id,
        order: 4,
      }),
      ReproductiveStage.create({
        name: 'Destete',
        farmId: farm.id,
        order: 5,
      }),
      ReproductiveStage.create({
        name: 'Reposo',
        farmId: farm.id,
        order: 6,
      }),
    ];
    const breeds = [
      Breed.create({ name: 'Yorkshire', farmId: farm.id }),
      Breed.create({ name: 'Landrace', farmId: farm.id }),
      Breed.create({ name: 'Duroc', farmId: farm.id }),
      Breed.create({ name: 'Hampshire', farmId: farm.id }),
      Breed.create({ name: 'Pietrain alemán', farmId: farm.id }),
      Breed.create({ name: 'Belga alemán', farmId: farm.id }),
      Breed.create({ name: 'Large White', farmId: farm.id }),
      Breed.create({ name: 'Criollo', farmId: farm.id }),
    ];
    const phases = [
      Phase.create({
        farmId: farm.id,
        name: 'Neonatal',
        order: 1,
      }),
      Phase.create({
        farmId: farm.id,
        name: 'Destete',
        order: 2,
      }),
      Phase.create({
        farmId: farm.id,
        name: 'Inicial',
        order: 3,
      }),
      Phase.create({
        farmId: farm.id,
        name: 'Crecimiento',
        order: 4,
      }),
      Phase.create({
        farmId: farm.id,
        name: 'Engorde',
        order: 5,
      }),
      Phase.create({
        farmId: farm.id,
        name: 'Finalizado',
        order: 6,
      }),
    ];

    const categories = [
      Category.create({
        name: 'Farmacos',
        farmId: farm.id,
      }),
      Category.create({
        name: 'Balanceados',
        farmId: farm.id,
      }),
    ];

    await this.settingRepository.create(setting);
    await this.breedRepository.createMany(breeds);
    await this.phaseRepository.createMany(phases);
    await this.farmRepository.createManyReproductiveStage(reproductiveState);
    await this.categoryRepository.createMany(categories);
  }
}
