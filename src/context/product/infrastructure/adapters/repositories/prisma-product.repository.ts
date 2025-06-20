import { inject, injectable } from 'tsyringe';
import { ProductRepository } from '../../../domain/ports/product.repository';
import { ProductMapper } from '../../mappers/product.mapper';
import { Product } from '../../../domain/entities/product.entity';
import { PrismaClient } from '@prisma/client';

@injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async getByName(name: string, farmId: string): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        name,
        farmId,
      },
      include: {
        category: true,
      },
    });
    if (!product) return null;
    return ProductMapper.toDomain(product);
  }

  async getByIdAndUserId(id: string, userId: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        farm: {
          OR: [
            {
              ownerId: userId,
            },
            {
              workers: { some: { userId } },
            },
          ],
        },
      },
      include: {
        category: true,
      },
    });

    if (!product) return null;
    return ProductMapper.toDomain(product);
  }

  async getById(id: string, farmId: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
        farmId,
      },
      include: {
        category: true,
      },
    });

    if (!product) return null;
    return ProductMapper.toDomain(product);
  }

  async save(product: Product): Promise<void> {
    await this.prisma.product.upsert({
      where: {
        id: product.id,
      },
      update: ProductMapper.toUpdatePersistence(product),
      create: ProductMapper.toCreatePersistence(product),
    });
  }

  async all(userId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        farm: {
          OR: [
            {
              ownerId: userId,
            },
            {
              workers: { some: { userId } },
            },
          ],
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return products.map((product) => ProductMapper.toDomain(product));
  }
}
