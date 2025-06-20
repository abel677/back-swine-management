import { inject, injectable } from 'tsyringe';
import { FarmRepository } from '../../domain/ports/farm.repository';

@injectable()
export class AllFarmUseCase {
  constructor(
    @inject('FarmRepository')
    private readonly farmRepository: FarmRepository,
  ) {}

  async execute(userId: string) {
    return await this.farmRepository.all(userId);
  }
}
