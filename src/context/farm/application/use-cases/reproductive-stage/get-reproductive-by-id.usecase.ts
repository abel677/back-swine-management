import { inject, injectable } from 'tsyringe';
import { ReproductiveStageRepository } from '../../../domain/ports/reproductive-stage.repository';

@injectable()
export class GetReproductiveStageByIdUseCase {
  constructor(
    @inject('ReproductiveStageRepository')
    private readonly reproductiveStageRepository: ReproductiveStageRepository,
  ) {}

  async execute(dto: { id: string; farmId: string }) {
    return await this.reproductiveStageRepository.getById(dto);
  }
}
