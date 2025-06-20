import { PrismaClient } from '@prisma/client';
import { PhaseRepository } from '../../../domain/ports/phase.repository';
import { Phase } from '../../../domain/entities/phase.entity';
import { PhaseMapper } from '../../mappers/phase.mapper';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaPhaseRepository implements PhaseRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async createMany(phases: Phase[]): Promise<void> {
    await this.prisma.phase.createMany({
      data: PhaseMapper.toCreateManyPersistence(phases),
    });
  }

  async getAll(userId: string): Promise<Phase[]> {
    const entities = await this.prisma.phase.findMany({
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
    return entities.map((entity) => PhaseMapper.toDomain(entity));
  }

  async getByName(dto: {
    name: string;
    farmId: string;
  }): Promise<Phase | null> {
    const entity = await this.prisma.phase.findFirst({
      where: { name: dto.name, farmId: dto.farmId },
    });
    if (!entity) return null;
    return PhaseMapper.toDomain(entity);
  }

  async getById(dto: { id: string; farmId: string }): Promise<Phase | null> {
    const entity = await this.prisma.phase.findUnique({
      where: { id: dto.id, farmId: dto.farmId },
    });
    if (!entity) return null;
    return PhaseMapper.toDomain(entity);
  }
}
