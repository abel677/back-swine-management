import { inject, injectable } from 'tsyringe';
import { PhaseRepository } from '../../../domain/ports/phase.repository';
import { Phase } from '../../../domain/entities/phase.entity';

@injectable()
export class GetPhaseByNameUseCase {
  constructor(
    @inject('PhaseRepository')
    private readonly phaseRepository: PhaseRepository,
  ) {}

  async execute(dto: { name: string; farmId: string }): Promise<Phase | null> {
    return await this.phaseRepository.getByName(dto);
  }
}
