import { inject, injectable } from 'tsyringe';
import { BreedRepository } from '../../domain/ports/breed-repository.port';
import { UpdateBreedDto } from '../dtos/update-breed.dto';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { Application } from '../../../../utils/http-error';
import { Breed } from '../../domain/breed.entity';

@injectable()
export class UpdateBreedUseCase {
  constructor(
    @inject('BreedRepository')
    private readonly breedRepository: BreedRepository,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
  ) {}

  async execute(
    id: string,
    userId: string,
    dto: UpdateBreedDto,
  ): Promise<Breed> {
    // verificar si existe la granja del usuario
    const breed = await this.breedRepository.getByIdAndUserId(id, userId);
    if (!breed) throw Application.notFound('Raza no encontrada.');
    // verificar si existe la raza en la granja del usuario
    if (dto.farmId) {
      const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
      if (!farm) {
        throw Application.notFound('Granja del usuario no encontrada.');
      }
      breed.saveFarm(farm);
    }
    // verificar si ya existe la raza con el mismo nombre
    if (dto.name) {
      const already = await this.breedRepository.getByName(
        dto.name,
        breed.farmId,
      );
      if (already && already.id !== breed.id) {
        throw Application.badRequest('Ya existe una raza con el mismo nombre.');
      }
      breed.saveName(dto.name);
    }
    this.breedRepository.save(breed);
    return breed;
  }
}
