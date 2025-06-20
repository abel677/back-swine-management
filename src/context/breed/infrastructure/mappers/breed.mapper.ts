import { Prisma } from '@prisma/client';
import { Breed } from '../../domain/breed.entity';

export class BreedMapper {
  static toHttpResponse(breed: Breed) {
    return {
      id: breed.id,
      name: breed.name,
      farmId: breed.farmId,
      createdAt: breed.createdAt,
      updatedAt: breed.updatedAt,
    };
  }

  static toDomain(data: any) {
    return Breed.toDomain({
      id: data.id,
      name: data.name,
      farmId: data.farmId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toCreatePersist(breed: Breed) {
    return {
      id: breed.id,
      name: breed.name,
      farm: {
        connect: {
          id: breed.farmId,
        },
      },
      createdAt: breed.createdAt,
      updatedAt: breed.updatedAt,
    };
  }
  static toUpdatePersist(breed: Breed) {
    return {
      name: breed.name,
      farm: {
        connect: {
          id: breed.farmId,
        },
      },
      createdAt: breed.createdAt,
      updatedAt: breed.updatedAt,
    };
  }

  static toCreateManyPersistence(
    breeds: Breed[],
  ): Prisma.BreedCreateManyInput[] {
    return breeds.map((breed) => ({
      id: breed.id,
      name: breed.name,
      farmId: breed.farmId,
      createdAt: breed.createdAt,
      updatedAt: breed.updatedAt,
    }));
  }
}
