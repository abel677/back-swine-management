import { inject, injectable } from 'tsyringe';
import { BreedRepository } from '../../domain/ports/breed-repository.port';
import { Breed } from '../../domain/breed.entity';

@injectable()
export class GetBreedByNameUseCase {
  constructor(
    @inject('BreedRepository')
    private readonly breedRepository: BreedRepository,
  ) {}

  async execute(dto: { name: string; farmId: string }): Promise<Breed | null> {
    return await this.breedRepository.getByName(dto.name, dto.farmId);
  }
}
