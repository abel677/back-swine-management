import { inject, injectable } from 'tsyringe';
import { ProductRepository } from '../../domain/ports/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { Application } from '../../../../utils/http-error';
import { CreateProductDto } from '../dtos/create-product.dto';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { GetCategoryByIdUseCase } from '../../../category/application/use-cases/get-category-by-id.usecase';
import { Category } from '../../../category/domain/entities/category.entity';
import { GetCategoryByNameUseCase } from '../../../category/application/use-cases/get-category-by-name.usecase';

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @inject('GetCategoryByIdUseCase')
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    @inject('GetCategoryByNameUseCase')
    private readonly getCategoryByNameUseCase: GetCategoryByNameUseCase,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
  ) {}

  async execute(userId: string, dto: CreateProductDto) {
    const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
    if (!farm) throw Application.notFound('Granja de usuario no encontrada');

    const product = await this.productRepository.getByName(
      dto.name,
      dto.farmId,
    );

    if (product) {
      throw Application.badRequest(
        'Ya existe un producto en la granja con el mismo nombre.',
      );
    }

    let category: Category | null;
    if (dto.category.id) {
      category = await this.getCategoryByIdUseCase.execute(
        dto.category.id,
        dto.farmId,
      );
      if (!category) {
        throw Application.notFound('Categoría no encontrada.');
      }
    }
    if (dto.category.name) {
      category = await this.getCategoryByNameUseCase.execute(
        dto.category.name,
        dto.farmId,
      );
      if (!category) {
        throw Application.notFound('Categoría no encontrada.');
      }
    }

    const newProduct = Product.create({
      name: dto.name,
      farmId: dto.farmId,
      category: category!,
      description: dto.description,
      price: dto.price,
      unitMeasurement: dto.unitMeasurement,
    });
    await this.productRepository.save(newProduct);
    return newProduct;
  }
}
