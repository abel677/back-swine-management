import { inject, injectable } from 'tsyringe';
import { PigRepository } from '../../domain/ports/pig.repository';
import { Application } from '../../../../utils/http-error';

@injectable()
export class DeletePigUseCase {
  constructor(
    @inject('PigRepository') private readonly pigRepository: PigRepository,
  ) {}

  async execute(dto: { userId: string; id: string }): Promise<void> {
    const pig = await this.pigRepository.getByIdAndUserId(dto.id, dto.userId);
    if (!pig) throw Application.notFound('Cerdo no disponible');
    await this.pigRepository.delete(dto.id);
  }
}
