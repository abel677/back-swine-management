import { inject, injectable } from 'tsyringe';
import { PhaseRepository } from '../../../domain/ports/phase.repository';
import { Phase } from '../../../domain/entities/phase.entity';

@injectable()
export class AllPhaseUseCase {
  constructor(
    @inject('PhaseRepository')
    private readonly phaseRepository: PhaseRepository,
  ) {}

  async execute(userId: string): Promise<Phase[]> {
    return await this.phaseRepository.getAll(userId);
  }
}
