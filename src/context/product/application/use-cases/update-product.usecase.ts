import { inject, injectable } from 'tsyringe';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductRepository } from '../../domain/ports/product.repository';
import { Application } from '../../../../utils/http-error';
import { GetFarmByIdUseCase } from '../../../farm/application/use-cases/get-farm-by-id.usecase';
import { GetCategoryByIdUseCase } from '../../../category/application/use-cases/get-category-by-id.usecase';

@injectable()
export class UpdateProductUseCase {
  constructor(
    @inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @inject('GetCategoryByIdUseCase')
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
  ) {}

  async execute(userId: string, productId: string, dto: UpdateProductDto) {
    const product = await this.productRepository.getByIdAndUserId(
      productId,
      userId,
    );
    if (!product) {
      throw Application.notFound('Producto no encontrado.');
    }

    if (dto.name && dto.name !== product.name) {
      const alreadyExist = await this.productRepository.getByName(
        dto.name,
        product.farmId,
      );

      if (alreadyExist) {
        throw Application.badRequest(
          'Ya existe un producto con el mismo nombre.',
        );
      }
      product.saveName(dto.name);
    }

    if (dto.description) {
      product.saveDescription(dto.description);
    }

    if (dto.unitMeasurement) {
      product.saveUnitMeasurement(dto.unitMeasurement);
    }

    if (dto.price) {
      product.savePrice(dto.price);
    }

    if (dto.farmId) {
      const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
      if (!farm) throw Application.notFound('Granja de usuario no encontrada');
      product.saveFarm(farm);
    }

    if (dto.category?.id) {
      const category = await this.getCategoryByIdUseCase.execute(
        dto.category.id,
        product.farmId,
      );

      if (!category) {
        throw Application.notFound('Categoría no encontrada.');
      }
      product.saveCategory(category);
    }

    await this.productRepository.save(product);

    return product;
  }
}
