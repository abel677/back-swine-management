import { CorralRepository } from './../../domain/ports/corral.repository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AllCorralUseCase {
  constructor(
    @inject('CorralRepository')
    private readonly corralRepository: CorralRepository,
  ) {}

  async execute(userId: string) {
    return await this.corralRepository.all(userId);
  }
}
