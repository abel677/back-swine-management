import { inject, injectable } from 'tsyringe';
import { BreedRepository } from '../../domain/ports/breed-repository.port';
import { CreateBreedDto } from '../dtos/create-breed.dto';
import { Breed } from '../../domain/breed.entity';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { Application } from '../../../../utils/http-error';

@injectable()
export class CreateBreedUseCase {
  constructor(
    @inject('BreedRepository')
    private readonly breedRepository: BreedRepository,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
  ) {}

  async execute(userId: string, dto: CreateBreedDto): Promise<Breed> {
    const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
    if (!farm) {
      throw Application.notFound('Granja no encontrada.');
    }

    const alreadyExist = await this.breedRepository.getByName(dto.name, userId);
    if (alreadyExist) {
      throw Application.badRequest('Ya existe una raza con el mismo nombre.');
    }

    const breed = Breed.create({
      farmId: farm.id,
      name: dto.name,
    });

    await this.breedRepository.save(breed);

    return breed;
  }
}
