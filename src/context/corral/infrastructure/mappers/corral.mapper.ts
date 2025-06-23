import { Prisma } from '@prisma/client';
import { Corral } from '../../domain/entities/corral.entity';
import { FarmMapper } from '../../../farm/infrastructure/mappers/farm.mapper';

type CorralWithPigs = Prisma.CorralGetPayload<{
  include: { pigs: true; farm: { include: { owner: true } } };
}>;

export class CorralMapper {
  static toHttpResponse(corral: Corral) {
    return {
      id: corral.id,
      farm: FarmMapper.toHttpResponse(corral.farm),
      name: corral.name,
      pigs: corral.pigs.map((pig) => ({
        id: pig.id,
      })),
    };
  }

  static toDomain(data: CorralWithPigs) {
    return Corral.toDomain({
      id: data.id,
      name: data.name,
      farm: FarmMapper.toDomain(data.farm),
      pigs: data.pigs.map((pig) => ({ id: pig.id })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toCreatePersistence(corral: Corral): Prisma.CorralCreateInput {
    return {
      id: corral.id,
      name: corral.name,
      farm: {
        connect: { id: corral.farm.id },
      },
      pigs: {
        connect: corral.pigs.map((pig) => ({ id: pig.id })),
      },
      createdAt: corral.createdAt,
      updatedAt: corral.updatedAt,
    };
  }

  static toUpdatePersistence(corral: Corral): Prisma.CorralUpdateInput {
    return {
      name: corral.name,
      farm: {
        connect: { id: corral.farm.id },
      },
      pigs: {
        set: corral.pigs.map((pig) => ({ id: pig.id })),
      },
      createdAt: corral.createdAt,
      updatedAt: corral.updatedAt,
    };
  }
}
