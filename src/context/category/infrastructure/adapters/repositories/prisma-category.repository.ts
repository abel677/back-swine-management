import { inject, injectable } from 'tsyringe';
import { CategoryRepository } from '../../../domain/ports/category.repository';
import { Category } from '../../../domain/entities/category.entity';
import { PrismaClient } from '@prisma/client';
import { CategoryMapper } from '../../mappers/category.mapper';

@injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async getByName(name: string, farmId: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        name,
        farmId,
      },
    });

    if (!category) {
      return null;
    }

    return Category.mapToDomain(category);
  }
  async getByIdAnUserId(id: string, userId: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
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
    });

    if (!category) {
      return null;
    }

    return Category.mapToDomain(category);
  }

  async getById(id: string, farmId: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
        farmId,
      },
    });

    if (!category) {
      return null;
    }

    return Category.mapToDomain(category);
  }

  async createMany(categories: Category[]): Promise<void> {
    await this.prisma.category.createMany({
      data: CategoryMapper.toCreateManyPersistence(categories),
      skipDuplicates: true,
    });
  }

  async save(category: Category): Promise<void> {
    await this.prisma.category.upsert({
      where: {
        id: category.id,
      },
      update: CategoryMapper.toUpdatePersistence(category),
      create: CategoryMapper.toCreatePersistence(category),
    });
  }

  async all(userId: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
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
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return categories.map((category) => Category.mapToDomain(category));
  }
}
