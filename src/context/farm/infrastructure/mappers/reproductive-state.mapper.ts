import { Prisma } from '@prisma/client';
import { ReproductiveStage } from '../../domain/entities/reproductive-stage.entity';

export class ReproductiveStageMapper {
  static toHttpResponse(reproductiveStage: ReproductiveStage) {
    return {
      id: reproductiveStage.id,
      name: reproductiveStage.name,
      order: reproductiveStage.order,
      farmId: reproductiveStage.farmId,
      createdAt: reproductiveStage.createdAt,
      updatedAt: reproductiveStage.updatedAt,
    };
  }
  static toDomain(reproductiveStage: any) {
    return ReproductiveStage.toDomain({
      id: reproductiveStage.id,
      name: reproductiveStage.name,
      order: reproductiveStage.order,
      farmId: reproductiveStage.farmId,
      createdAt: reproductiveStage.createdAt,
      updatedAt: reproductiveStage.updatedAt,
    });
  }

  static toCreatePersistence(
    reproductiveStage: ReproductiveStage,
  ): Prisma.ReproductiveStageCreateInput {
    return {
      id: reproductiveStage.id,
      name: reproductiveStage.name,
      order: reproductiveStage.order,
      farm: {
        connect: { id: reproductiveStage.farmId },
      },
      createdAt: reproductiveStage.createdAt,
      updatedAt: reproductiveStage.updatedAt,
    };
  }

  static toCreateManyPersistence(
    reproductiveStages: ReproductiveStage[],
  ): Prisma.ReproductiveStageCreateManyInput[] {
    return reproductiveStages.map((reproductiveStage) => ({
      id: reproductiveStage.id,
      name: reproductiveStage.name,
      order: reproductiveStage.order,
      farmId: reproductiveStage.farmId,
      createdAt: reproductiveStage.createdAt,
      updatedAt: reproductiveStage.updatedAt,
    }));
  }

  static toUpdatePersistence(
    reproductiveStage: ReproductiveStage,
  ): Prisma.ReproductiveStageUpdateInput {
    return {
      name: reproductiveStage.name,
      farm: {
        connect: { id: reproductiveStage.farmId },
      },
      createdAt: reproductiveStage.createdAt,
      updatedAt: reproductiveStage.updatedAt,
    };
  }
}
