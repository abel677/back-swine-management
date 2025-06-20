import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import { CorralRepository } from '../../domain/ports/corral.repository';
import { Corral } from '../../domain/entities/corral.entity';
import { CorralMapper } from '../mappers/corral.mapper';

@injectable()
export class PrismaCorralRepository implements CorralRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async all(userId: string): Promise<Corral[]> {
    const corrals = await this.prisma.corral.findMany({
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
        pigs: true,
        farm: {
          include: {
            owner: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return corrals.map((corral) => CorralMapper.toDomain(corral));
  }

  async save(corral: Corral): Promise<void> {
    await this.prisma.corral.upsert({
      where: { id: corral.id },
      create: CorralMapper.toCreatePersistence(corral),
      update: CorralMapper.toUpdatePersistence(corral),
    });
  }

  async getByName(name: string, userId: string): Promise<Corral | null> {
    const corral = await this.prisma.corral.findFirst({
      where: {
        name,
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
        pigs: true,
        farm: {
          include: {
            owner: true,
          },
        },
      },
    });
    if (!corral) return null;
    return CorralMapper.toDomain(corral);
  }

  async getById(id: string, userId: string): Promise<Corral | null> {
    const corral = await this.prisma.corral.findUnique({
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
        pigs: true,
        farm: {
          include: {
            owner: true,
          },
        },
      },
    });
    if (!corral) return null;
    return CorralMapper.toDomain(corral);
  }
}
