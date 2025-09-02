import { CategoryMapper } from '../../../category/infrastructure/mappers/category.mapper';
import { Product } from '../../domain/entities/product.entity';
import { Prisma } from '@prisma/client';

export class ProductMapper {
  static toHttpResponse(product: Product) {
    return {
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      unitMeasurement: product.unitMeasurement,
      category: CategoryMapper.toHttpResponse(product.category),
      farmId: product.farmId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
  static toDomain(productPrisma: any): Product {
    return Product.mapToDomain({
      id: productPrisma.id,
      farmId: productPrisma.farmId,
      category: CategoryMapper.toDomain(productPrisma.category),
      name: productPrisma.name,
      description: productPrisma.description || '',
      price: productPrisma.price.toNumber(),
      unitMeasurement: productPrisma.unitMeasurement,
      updatedAt: productPrisma.updatedAt,
      createdAt: productPrisma.createdAt,
    });
  }

  static toCreatePersistence(product: Product): Prisma.ProductCreateInput {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      unitMeasurement: product.unitMeasurement,
      category: {
        connect: { id: product.category.id },
      },
      farm: { connect: { id: product.farmId } },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toUpdatePersistence(product: Product): Prisma.ProductUpdateInput {
    return {
      name: product.name,
      description: product.description,
      price: product.price,
      unitMeasurement: product.unitMeasurement,
      category: {
        connect: { id: product.category.id },
      },
      farm: { connect: { id: product.farmId } },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
