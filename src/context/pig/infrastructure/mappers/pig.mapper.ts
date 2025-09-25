import { Pig as PigPrisma } from './../../domain/entities/pig.entity';
import { Prisma } from '@prisma/client';
import { Pig } from '../../domain/entities/pig.entity';
import { FarmMapper } from '../../../farm/infrastructure/mappers/farm.mapper';
import { ReproductiveCycleMapper } from './reproductive-cycle.mapper';
import { BreedMapper } from '../../../breed/infrastructure/mappers/breed.mapper';
import { PhaseMapper } from '../../../farm/infrastructure/mappers/phase.mapper';
import { PigWeightMapper } from './pig-weight.mapper';
import { PigProductMapper } from './pig-product.mapper';

export class PigMapper {
  static toHttpResponse(pig: Pig): any {
    return {
      id: pig.id,
      earTag: pig.earTag,
      birthDate: pig.birthDate,
      gender: pig.gender,
      type: pig.type,
      farm: FarmMapper.toHttpResponse(pig.farm),
      breed: BreedMapper.toHttpResponse(pig.breed),
      phase: PhaseMapper.toHttpResponse(pig.phase),
      initialPrice: pig.initialPrice,
      investedPrice: pig.investedPrice,
      state: pig.state,
      weaned: pig.weaned,
      birthId: pig.birthId,
      motherId: pig.motherId,
      fatherId: pig.fatherId,
      corralId: pig.corralId || null,
      pigProduct: pig.pigProduct?.map((p) =>
        PigProductMapper.fromDomainToHttpResponse(p),
      ),
      weights: pig.weights?.map((w) =>
        PigWeightMapper.fromDomainToHttpResponse(w),
      ),
      sowReproductiveCycle: pig.sowReproductiveCycle?.map((src) =>
        ReproductiveCycleMapper.toHttpResponse(src),
      ),
      currentSowReproductiveCycle:
        pig.sowReproductiveCycle?.length > 0
          ? ReproductiveCycleMapper.toHttpResponse(pig.sowReproductiveCycle[0])
          : null,
      //childrenFromMother: pig.childrenFromMother,
    };
  }

  static toDomain(data: any) {
    return Pig.toDomain({
      id: data.id,
      earTag: data.earTag,
      birthDate: data.birthDate,
      gender: data.gender,
      type: data.type,
      farm: FarmMapper.toDomain(data.farm),
      breed: BreedMapper.toDomain(data.breed),
      phase: PhaseMapper.toDomain(data.phase),
      initialPrice: data.initialPrice.toNumber(),
      investedPrice: data.investedPrice.toNumber(),
      state: data.state,
      weaned: data.weaned,
      birthId: data.birthId,
      motherId: data.motherId,
      fatherId: data.fatherId,
      corralId: data.corralId,
      weights: data.weights?.map((w: any) =>
        PigWeightMapper.fromPersistenceToDomain(w),
      ),
      pigProduct: data.pigProduct?.map((p: any) =>
        PigProductMapper.fromPersistenceToDomain(p),
      ),
      sowReproductiveCycle: data.sowReproductiveCycle?.map((rc: any) =>
        ReproductiveCycleMapper.toDomain(rc),
      ),
      sowCurrentReproductiveCycle:
        data.sowReproductiveCycle && data.sowReproductiveCycle.length > 0
          ? ReproductiveCycleMapper.toDomain(data.sowReproductiveCycle[0])
          : null,
      //childrenFromMother: data.childrenFromMother,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  static toCreatePersistence(pig: Pig): Prisma.PigCreateInput {
    const newPig = {
      id: pig.id,
      earTag: pig.earTag,
      birthDate: pig.birthDate,
      gender: pig.gender,
      type: pig.type,
      farm: { connect: { id: pig.farm.id } },
      breed: { connect: { id: pig.breed.id } },
      phase: { connect: { id: pig.phase.id } },
      initialPrice: pig.initialPrice,
      investedPrice: pig.investedPrice,
      state: pig.state,
      birth: pig.birthId ? { connect: { id: pig.birthId } } : undefined,
      mother: pig.motherId ? { connect: { id: pig.motherId } } : undefined,
      father: pig.fatherId ? { connect: { id: pig.fatherId } } : undefined,
      sowReproductiveCycle: {
        create: pig.sowReproductiveCycle?.map((rc) => {
          return {
            id: rc.id,
            startDate: rc.startDate,
            endDate: rc.endDate,
            createdAt: pig.createdAt,
            updatedAt: pig.createdAt,
            boar: rc.boarId
              ? {
                  connect: { id: rc.boarId },
                }
              : undefined,
            reproductiveStage: { connect: { id: rc.reproductiveStage.id } },
            birth: rc.birth
              ? {
                  create: {
                    id: rc.birth.id,
                    date: rc.birth.date,
                    numberBirth: rc.birth.numberBirth,
                    liveMales: rc.birth.liveMales,
                    liveFemales: rc.birth.liveFemales,
                    totalDead: rc.birth.totalDead,
                    avgWeight: rc.birth.avgWeight,
                    description: rc.birth.description,
                    weanedAt: rc.birth.weanedAt,
                    piglets: {
                      create: rc.birth.piglets?.map((piglet) => {
                        return {
                          id: piglet.id,
                          earTag: piglet.earTag,
                          birthDate: piglet.birthDate,
                          gender: piglet.gender,
                          type: piglet.type,
                          initialPrice: piglet.initialPrice,
                          investedPrice: piglet.investedPrice,
                          state: piglet.state,
                          farm: { connect: { id: piglet.farm.id } },
                          breed: { connect: { id: piglet.breed.id } },
                          phase: { connect: { id: piglet.phase.id } },
                          mother: { connect: { id: piglet.motherId } },
                          father: piglet.fatherId
                            ? { connect: { id: piglet.fatherId } }
                            : undefined,
                          createdAt: piglet.createdAt,
                          updatedAt: piglet.updatedAt,
                        };
                      }),
                    },
                  },
                }
              : undefined,
          };
        }),
      },
      boarReproductiveCycle: undefined,
      createdAt: pig.createdAt,
      updatedAt: pig.updatedAt,
      remove: false,
    };
    return newPig;
  }

  static toUpdatePersistence(pig: Pig): Prisma.PigUpdateInput {
    return {
      earTag: pig.earTag,
      birthDate: pig.birthDate,
      gender: pig.gender,
      type: pig.type,
      farm: { connect: { id: pig.farm.id } },
      breed: { connect: { id: pig.breed.id } },
      phase: { connect: { id: pig.phase.id } },
      initialPrice: pig.initialPrice,
      investedPrice: pig.investedPrice,
      state: pig.state,
      birth: pig.birthId ? { connect: { id: pig.birthId } } : undefined,
      mother: pig.motherId ? { connect: { id: pig.motherId } } : undefined,
      father: pig.fatherId ? { connect: { id: pig.fatherId } } : undefined,
      weights: {
        upsert: pig.weights.map((w) => ({
          where: { id: w.id },
          update: PigWeightMapper.toUpdatePersistence(w),
          create: {
            id: w.id,
            days: w.days,
            weight: w.weight,
            createdAt: w.createdAt,
            updatedAt: w.updatedAt,
          },
        })),
      },
      pigProduct: {
        upsert: pig.pigProduct.map((p) => {
          return {
            where: { id: p.id },
            update: {
              quantity: p.quantity,
              price: p.price,
              product: {
                connect: {
                  id: p.product.id,
                },
              },
              updatedAt: p.updatedAt,
              date: p.date,
            },
            create: {
              id: p.id,
              quantity: p.quantity,
              price: p.price,
              date: p.date,
              product: {
                connect: {
                  id: p.product.id,
                },
              },
              createdAt: p.createdAt,
              updatedAt: p.updatedAt,
            },
          };
        }),
      },
      sowReproductiveCycle: {
        upsert: pig.sowReproductiveCycle?.map((rc) => {
          return {
            where: { id: rc.id },
            update: {
              startDate: rc.startDate,
              endDate: rc.endDate,
              updatedAt: pig.updatedAt,
              boar: rc.boarId
                ? {
                    connect: { id: rc.boarId },
                  }
                : undefined,
              reproductiveStage: { connect: { id: rc.reproductiveStage.id } },
              birth: rc.birth
                ? {
                    upsert: {
                      where: { id: rc.birth.id },
                      update: {
                        date: rc.birth.date,
                        numberBirth: rc.birth.numberBirth,
                        liveMales: rc.birth.liveMales,
                        liveFemales: rc.birth.liveFemales,
                        totalDead: rc.birth.totalDead,
                        avgWeight: rc.birth.avgWeight,
                        description: rc.birth.description,
                        weanedAt: rc.birth.weanedAt,
                        piglets: {
                          upsert: rc.birth.piglets.map((piglet) => ({
                            where: { id: piglet.id },
                            update: {
                              earTag: piglet.earTag,
                              birthDate: piglet.birthDate,
                              gender: piglet.gender,
                              type: piglet.type,
                              farm: { connect: { id: piglet.farm.id } },
                              breed: { connect: { id: piglet.breed.id } },
                              initialPrice: piglet.initialPrice,
                              investedPrice: piglet.investedPrice,
                              state: piglet.state,
                              phase: { connect: { id: piglet.phase.id } },
                              mother: { connect: { id: piglet.motherId } },
                              father: piglet.fatherId
                                ? { connect: { id: piglet.fatherId } }
                                : undefined,
                              createdAt: piglet.createdAt,
                              updatedAt: piglet.updatedAt,
                            },
                            create: {
                              id: piglet.id,
                              earTag: piglet.earTag,
                              birthDate: piglet.birthDate,
                              gender: piglet.gender,
                              type: piglet.type,
                              initialPrice: piglet.initialPrice,
                              investedPrice: piglet.investedPrice,
                              state: piglet.state,
                              farm: { connect: { id: piglet.farm.id } },
                              breed: { connect: { id: piglet.breed.id } },
                              phase: { connect: { id: piglet.phase.id } },
                              mother: { connect: { id: piglet.motherId } },
                              father: piglet.fatherId
                                ? { connect: { id: piglet.fatherId } }
                                : undefined,
                              createdAt: piglet.createdAt,
                              updatedAt: piglet.updatedAt,
                            },
                          })),
                        },
                      },
                      create: {
                        id: rc.birth.id,
                        date: rc.birth.date,
                        numberBirth: rc.birth.numberBirth,
                        liveMales: rc.birth.liveMales,
                        liveFemales: rc.birth.liveFemales,
                        totalDead: rc.birth.totalDead,
                        avgWeight: rc.birth.avgWeight,
                        description: rc.birth.description,
                        weanedAt: rc.birth.weanedAt,
                        piglets: {
                          create: rc.birth.piglets.map((piglet) => ({
                            id: piglet.id,
                            earTag: piglet.earTag,
                            birthDate: piglet.birthDate,
                            gender: piglet.gender,
                            type: piglet.type,
                            initialPrice: piglet.initialPrice,
                            investedPrice: piglet.investedPrice,
                            state: piglet.state,
                            farm: { connect: { id: piglet.farm.id } },
                            breed: { connect: { id: piglet.breed.id } },
                            phase: { connect: { id: piglet.phase.id } },
                            mother: { connect: { id: piglet.motherId } },
                            father: piglet.fatherId
                              ? { connect: { id: piglet.fatherId } }
                              : undefined,
                            createdAt: piglet.createdAt,
                            updatedAt: piglet.updatedAt,
                          })),
                        },
                      },
                    },
                  }
                : undefined,
            },
            create: {
              id: rc.id,
              startDate: rc.startDate,
              endDate: rc.endDate,
              boar: rc.boarId
                ? {
                    connect: { id: rc.boarId },
                  }
                : undefined,
              reproductiveStage: { connect: { id: rc.reproductiveStage.id } },
              birth: rc.birth
                ? {
                    create: {
                      id: rc.birth.id,
                      date: rc.birth.date,
                      numberBirth: rc.birth.numberBirth,
                      liveMales: rc.birth.liveMales,
                      liveFemales: rc.birth.liveFemales,
                      totalDead: rc.birth.totalDead,
                      avgWeight: rc.birth.avgWeight,
                      description: rc.birth.description,
                      weanedAt: rc.birth.weanedAt,
                      piglets: {
                        create: rc.birth.piglets.map((piglet) => ({
                          id: piglet.id,
                          earTag: piglet.earTag,
                          birthDate: piglet.birthDate,
                          gender: piglet.gender,
                          type: piglet.type,
                          initialPrice: piglet.initialPrice,
                          investedPrice: piglet.investedPrice,
                          state: piglet.state,
                          farm: { connect: { id: piglet.farm.id } },
                          breed: { connect: { id: piglet.breed.id } },
                          phase: { connect: { id: piglet.phase.id } },
                          mother: { connect: { id: piglet.motherId } },
                          father: piglet.fatherId
                            ? { connect: { id: piglet.fatherId } }
                            : undefined,
                          createdAt: piglet.createdAt,
                          updatedAt: piglet.updatedAt,
                        })),
                      },
                    },
                  }
                : undefined,
            },
          };
        }),
      },
      createdAt: pig.createdAt,
      updatedAt: pig.updatedAt,
    };
  }
}
