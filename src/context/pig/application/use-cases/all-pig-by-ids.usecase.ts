import { Pig } from '../../domain/entities/pig.entity';
import { PigRepository } from './../../domain/ports/pig.repository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AllPigByIdsUseCase {
  constructor(
    @inject('PigRepository') private readonly pigRepository: PigRepository,
  ) {}

  async execute(ids: { id: string }[], farmId: string): Promise<Pig[]> {
    return await this.pigRepository.getByIds(ids, farmId);
  }
}
