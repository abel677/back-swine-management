import { inject, injectable } from 'tsyringe';
import { BreedRepository } from '../../domain/ports/breed-repository.port';
import { Breed } from '../../domain/breed.entity';

@injectable()
export class AllBreedUseCase {
  constructor(
    @inject('BreedRepository')
    private readonly breedRepository: BreedRepository,
  ) {}

  async execute(userId: string): Promise<Breed[]> {
    return await this.breedRepository.all(userId);
  }
}
