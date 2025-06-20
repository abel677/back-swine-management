import { inject, injectable } from 'tsyringe';
import { ProductRepository } from '../../domain/ports/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { Application } from '../../../../utils/http-error';
import { CreateProductDto } from '../dtos/create-product.dto';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { GetCategoryByIdUseCase } from '../../../category/application/use-cases/get-category-by-id.usecase';

@injectable()
export class CreateProductUseCase {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @inject('GetCategoryByIdUseCase')
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
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

    const category = await this.getCategoryByIdUseCase.execute(
      dto.categoryId,
      dto.farmId,
    );
    if (!category) {
      throw Application.notFound('Categoría no encontrada.');
    }

    const newProduct = Product.create({
      name: dto.name,
      farmId: dto.farmId,
      category: category,
      description: dto.description,
      price: dto.price,
    });
    await this.productRepository.save(newProduct);
    return newProduct;
  }
}
