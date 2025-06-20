import { Application } from '../../../../utils/http-error';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { CategoryRepository } from './../../domain/ports/category.repository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdateCategoryUseCase {
  constructor(
    @inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
  ) {}

  async execute(id: string, userId: string, dto: UpdateCategoryDto) {
    const category = await this.categoryRepository.getByIdAnUserId(id, userId);
    if (!category) throw Application.notFound('Categoria no encontrada.');

    if (dto.farmId) {
      const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
      if (!farm) {
        throw Application.notFound('Granja del usuario no encontrada.');
      }
      category.saveFarm(farm);
    }
    if (dto.name) {
      const already = await this.categoryRepository.getByName(
        dto.name,
        category.farmId,
      );
      if (already && already.id !== category.id) {
        throw Application.badRequest('Ya existe una raza con el mismo nombre.');
      }
      category.saveName(dto.name);
    }

    await this.categoryRepository.save(category);
    return category;
  }
}
