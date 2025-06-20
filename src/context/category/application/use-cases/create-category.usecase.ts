import { inject, injectable } from 'tsyringe';
import { CategoryRepository } from '../../domain/ports/category.repository';
import { Category } from '../../domain/entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { Application } from '../../../../utils/http-error';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';

@injectable()
export class CreateCategoryUseCase {
  constructor(
    @inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
  ) {}

  async execute(userId: string, dto: CreateCategoryDto) {
    const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
    if (!farm) throw Application.notFound('Granja de usuario no encontrada');

    const already = await this.categoryRepository.getByName(dto.name, farm.id);
    if (already) {
      throw Application.notFound('La categoria ya existe en la granja.');
    }

    const category = Category.create({
      name: dto.name,
      farmId: dto.farmId,
    });
    await this.categoryRepository.save(category);
    return category;
  }
}
