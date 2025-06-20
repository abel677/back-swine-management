import { inject, injectable } from 'tsyringe';
import { PigRepository } from '../../domain/ports/pig.repository';
import { Pig } from '../../domain/entities/pig.entity';

@injectable()
export class AllPigUseCase {
  constructor(
    @inject('PigRepository') private readonly pigRepository: PigRepository,
  ) {}

  async execute(userId: string): Promise<Pig[]> {
    return await this.pigRepository.all(userId);
  }
}
