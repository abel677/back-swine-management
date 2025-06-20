import { Prisma } from '@prisma/client';
import { PigProduct } from '../../domain/entities/pig-product.entity';
import { ProductMapper } from '../../../product/infrastructure/mappers/product.mapper';

export class PigProductMapper {
  static fromDomainToHttpResponse(pigProduct: PigProduct) {
    return {
      id: pigProduct.id,
      pigId: pigProduct.pigId,
      product: ProductMapper.toHttpResponse(pigProduct.product),
      price: pigProduct.price,
      quantity: pigProduct.quantity,
      date: pigProduct.date,
      createdAt: pigProduct.createdAt,
      updatedAt: pigProduct.updatedAt,
    };
  }

  static fromPersistenceToDomain(
    data: Prisma.PigProductGetPayload<{
      include: {
        product: {
          include: {
            category: true;
            farm: true;
          };
        };
      };
    }>,
  ) {
    return PigProduct.fromPrimitives({
      id: data.id,
      pigId: data.pigId,
      product: ProductMapper.toDomain(data.product),
      quantity: data.quantity.toNumber(),
      price: data.price.toNumber(),
      date: data.date || data.updatedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toCreatePersistence(
    pigProduct: PigProduct,
  ): Prisma.PigProductCreateInput {
    return {
      id: pigProduct.id,
      pig: {
        connect: {
          id: pigProduct.pigId,
        },
      },
      product: {
        connect: {
          id: pigProduct.product.id,
        },
      },
      price: pigProduct.price,
      date: pigProduct.date,
      quantity: pigProduct.quantity,
      createdAt: pigProduct.createdAt,
      updatedAt: pigProduct.updatedAt,
    };
  }
  static toUpdatePersistence(
    pigProduct: PigProduct,
  ): Prisma.PigProductUpdateInput {
    return {
      pig: {
        connect: {
          id: pigProduct.pigId,
        },
      },
      product: {
        connect: {
          id: pigProduct.product.id,
        },
      },
      price: pigProduct.price,
      date: pigProduct.date,
      quantity: pigProduct.quantity,
      updatedAt: pigProduct.updatedAt,
    };
  }
}
