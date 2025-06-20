import { inject, injectable } from 'tsyringe';
import { CategoryRepository } from '../../domain/ports/category.repository';

@injectable()
export class AllCategoryUseCase {
  constructor(
    @inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(userId: string) {
    return await this.categoryRepository.all(userId);
  }
}
