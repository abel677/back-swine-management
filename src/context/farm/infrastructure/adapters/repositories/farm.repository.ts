import { inject, injectable } from 'tsyringe';
import { FarmRepository } from '../../../domain/ports/farm.repository';
import { Farm } from '../../../domain/entities/farm.entity';
import { PrismaClient } from '@prisma/client';
import { FarmMapper } from '../../mappers/farm.mapper';
import { ReproductiveStage } from '../../../domain/entities/reproductive-stage.entity';
import { ReproductiveStageMapper } from '../../mappers/reproductive-state.mapper';

@injectable()
export class PrismaFarmRepository implements FarmRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async createManyReproductiveStage(
    reproductiveStates: ReproductiveStage[],
  ): Promise<void> {
    const data = reproductiveStates.map((stage) => ({
      id: stage.id,
      name: stage.name,
      order: stage.order,
      farmId: stage.farmId,
      createdAt: stage.createdAt,
      updatedAt: stage.updatedAt,
    }));

    await this.prisma.reproductiveStage.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async AllReproductiveStageUseCase(
    farmId: string,
  ): Promise<ReproductiveStage[]> {
    const reproductiveStage = await this.prisma.reproductiveStage.findMany({
      where: { farmId: farmId },
      include: { farm: { include: { owner: true } } },
      orderBy: {
        order: 'asc',
      },
    });
    return reproductiveStage.map((rs) => ReproductiveStageMapper.toDomain(rs));
  }

  async getById(id: string, userId: string): Promise<Farm | null> {
    const farm = await this.prisma.farm.findFirst({
      where: {
        id,
        OR: [{ ownerId: userId }, { workers: { some: { userId } } }],
      },
      include: { owner: true },
    });

    if (!farm) return null;
    return FarmMapper.toDomain(farm);
  }

  async all(userId: string): Promise<Farm[]> {
    const farms = await this.prisma.farm.findMany({
      where: {
        OR: [{ ownerId: userId }, { workers: { some: { userId } } }],
      },
      include: {
        owner: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return farms.map((farm) => FarmMapper.toDomain(farm));
  }

  async save(farm: Farm): Promise<void> {
    await this.prisma.farm.upsert({
      where: { id: farm.id },
      create: {
        id: farm.id,
        name: farm.name,
        owner: {
          connect: {
            id: farm.owner.id,
          },
        },
        createdAt: farm.createdAt,
        updatedAt: farm.updatedAt,
      },
      update: {
        name: farm.name,
        owner: {
          connect: {
            id: farm.owner.id,
          },
        },
        updatedAt: farm.updatedAt,
      },
    });
  }
}
