import { inject, injectable } from 'tsyringe';
import { BreedRepository } from '../../../domain/ports/breed-repository.port';
import { PrismaClient } from '@prisma/client';
import { Breed } from '../../../domain/breed.entity';
import { BreedMapper } from '../../mappers/breed.mapper';

@injectable()
export class PrismaBreedRepository implements BreedRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async all(userId: string): Promise<Breed[]> {
    const breeds = await this.prisma.breed.findMany({
      where: {
        farm: {
          OR: [{ ownerId: userId }, { workers: { some: { userId: userId } } }],
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return breeds.map((breed) => BreedMapper.toDomain(breed));
  }

  // async getByNames(
  //   names: { name: string }[],
  //   farmId: string,
  // ): Promise<Breed[]> {
  //   const nameList = names.map((item) => item.name);
  //   const breeds = await this.prisma.breed.findMany({
  //     where: { name: { in: nameList }, farmId: farmId },
  //   });
  //   return breeds.map((breed) => BreedMapper.toDomain(breed));
  // }

  async getByName(name: string, farmId: string): Promise<Breed | null> {
    const breed = await this.prisma.breed.findFirst({
      where: { name: name, farmId: farmId },
    });
    if (!breed) return null;
    return BreedMapper.toDomain(breed);
  }

  async getByIdAndUserId(id: string, userId: string): Promise<Breed | null> {
    const breed = await this.prisma.breed.findFirst({
      where: {
        id: id,
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

    if (!breed) return null;
    return BreedMapper.toDomain(breed);
  }

  async getById(id: string, farmId: string): Promise<Breed | null> {
    const breed = await this.prisma.breed.findFirst({
      where: { id: id, farmId: farmId },
    });

    if (!breed) return null;
    return BreedMapper.toDomain(breed);
  }

  async save(breed: Breed): Promise<void> {
    await this.prisma.breed.upsert({
      where: { id: breed.id },
      create: BreedMapper.toCreatePersist(breed),
      update: BreedMapper.toUpdatePersist(breed),
    });
  }

  async createMany(breeds: Breed[]): Promise<void> {
    await this.prisma.breed.createMany({
      data: BreedMapper.toCreateManyPersistence(breeds),
    });
  }
}
