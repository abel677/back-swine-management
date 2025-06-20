import { inject, injectable } from 'tsyringe';
import { CategoryRepository } from '../../domain/ports/category.repository';

@injectable()
export class GetCategoryByIdUseCase {
  constructor(
    @inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(id: string, farmId: string) {
    return await this.categoryRepository.getById(id, farmId);
  }
}
