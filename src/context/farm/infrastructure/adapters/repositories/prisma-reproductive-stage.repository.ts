import { PrismaClient } from '@prisma/client';
import { ReproductiveStageRepository } from '../../../domain/ports/reproductive-stage.repository';
import { ReproductiveStage } from '../../../domain/entities/reproductive-stage.entity';
import { ReproductiveStageMapper } from '../../mappers/reproductive-state.mapper';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaReproductiveStageRepository
  implements ReproductiveStageRepository
{
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async createMany(reproductiveStages: ReproductiveStage[]): Promise<void> {
    await this.prisma.reproductiveStage.createMany({
      data: ReproductiveStageMapper.toCreateManyPersistence(reproductiveStages),
    });
  }

  async getAll(userId: string): Promise<ReproductiveStage[]> {
    const entities = await this.prisma.reproductiveStage.findMany({
      where: {
        farm: {
          OR: [
            {
              ownerId: userId,
            },
            { workers: { some: { userId: userId } } },
          ],
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return entities.map((entity) => ReproductiveStageMapper.toDomain(entity));
  }

  async getByName(name: string): Promise<ReproductiveStage | null> {
    const entity = await this.prisma.reproductiveStage.findFirst({
      where: { name },
    });
    if (!entity) return null;
    return ReproductiveStageMapper.toDomain(entity);
  }

  async getById(dto: {
    id: string;
    farmId: string;
  }): Promise<ReproductiveStage | null> {
    const entity = await this.prisma.reproductiveStage.findUnique({
      where: { id: dto.id, farmId: dto.farmId },
    });
    if (!entity) return null;
    return ReproductiveStageMapper.toDomain(entity);
  }
}
