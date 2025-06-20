import { inject, injectable } from 'tsyringe';
import { PhaseRepository } from '../../../domain/ports/phase.repository';
import { Phase } from '../../../domain/entities/phase.entity';

@injectable()
export class GetPhaseByIdUseCase {
  constructor(
    @inject('PhaseRepository')
    private readonly phaseRepository: PhaseRepository,
  ) {}

  async execute(dto: { id: string; farmId: string }): Promise<Phase | null> {
    return await this.phaseRepository.getById(dto);
  }
}
