import { inject, injectable } from 'tsyringe';
import { CategoryRepository } from '../../domain/ports/category.repository';

@injectable()
export class GetCategoryByNameUseCase {
  constructor(
    @inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(name: string, farmId: string) {
    return await this.categoryRepository.getByName(name, farmId);
  }
}
