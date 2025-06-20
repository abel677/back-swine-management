import { inject, injectable } from 'tsyringe';
import { BreedRepository } from '../../domain/ports/breed-repository.port';

@injectable()
export class GetBreedByIdUseCase {
  constructor(
    @inject('BreedRepository')
    private readonly breedRepository: BreedRepository,
  ) {}

  async execute(id: string, farmId: string) {
    return await this.breedRepository.getById(id, farmId);
  }
}
