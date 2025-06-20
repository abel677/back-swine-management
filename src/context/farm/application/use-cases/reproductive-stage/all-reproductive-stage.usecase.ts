import { inject, injectable } from 'tsyringe';
import { ReproductiveStageRepository } from '../../../domain/ports/reproductive-stage.repository';

@injectable()
export class AllReproductiveStageUseCase {
  constructor(
    @inject('ReproductiveStageRepository')
    private readonly farmRepository: ReproductiveStageRepository,
  ) {}

  async execute(userId: string) {
    return await this.farmRepository.getAll(userId);
  }
}
