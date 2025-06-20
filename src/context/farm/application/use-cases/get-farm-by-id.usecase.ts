import { inject, injectable } from 'tsyringe';
import { FarmRepository } from '../../domain/ports/farm.repository';

@injectable()
export class GetFarmByIdUseCase {
  constructor(
    @inject('FarmRepository')
    private readonly farmRepository: FarmRepository,
  ) {}

  async execute(id: string, userId: string) {
    return await this.farmRepository.getById(id, userId);
  }
}
