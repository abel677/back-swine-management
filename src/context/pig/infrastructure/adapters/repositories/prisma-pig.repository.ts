import { inject, injectable } from 'tsyringe';
import { PigRepository } from '../../../domain/ports/pig.repository';
import { Pig } from '../../../domain/entities/pig.entity';
import { PrismaClient } from '@prisma/client';
import { PigMapper } from '../../mappers/pig.mapper';

@injectable()
export class PrismaPigRepository implements PigRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async delete(id: string): Promise<void> {
    await this.prisma.pig.update({
      where: { id },
      data: {
        remove: true,
        earTag: `removed-${new Date().toISOString()}`,
      },
    });
  }

  async all(userId: string): Promise<Pig[]> {
    const pigs = await this.prisma.pig.findMany({
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
        remove: false,
      },
      include: {
        breed: true,
        phase: true,
        farm: {
          include: {
            owner: true,
          },
        },
        weights: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        pigProduct: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        sowReproductiveCycle: {
          include: {
            reproductiveStage: true,
            birth: {
              include: {
                piglets: {
                  include: {
                    farm: {
                      include: { owner: true },
                    },
                    breed: true,
                    phase: true,
                    weights: {
                      orderBy: {
                        createdAt: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return pigs.map((pig) => PigMapper.toDomain(pig));
  }

  async save(pig: Pig): Promise<void> {
    await this.prisma.pig.upsert({
      where: { id: pig.id },
      create: PigMapper.toCreatePersistence(pig),
      update: PigMapper.toUpdatePersistence(pig),
    });
  }

  async getByIdAndUserId(id: string, userId: string): Promise<Pig | null> {
    const pig = await this.prisma.pig.findFirst({
      where: {
        id: id,
        remove: false,
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
        breed: true,
        phase: true,
        farm: {
          include: {
            owner: true,
          },
        },
        weights: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        pigProduct: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        childrenFromMother: true,
        sowReproductiveCycle: {
          include: {
            reproductiveStage: true,
            birth: {
              include: {
                piglets: {
                  include: {
                    farm: {
                      include: { owner: true },
                    },
                    breed: true,
                    phase: true,
                    weights: {
                      orderBy: {
                        createdAt: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    if (!pig) return null;
    return PigMapper.toDomain(pig);
  }

  async getByIds(ids: { id: string }[], farmId: string): Promise<Pig[]> {
    const pigs = await this.prisma.pig.findMany({
      where: {
        id: { in: ids.map((pig) => pig.id) },
        farmId: farmId,
        remove: false,
      },
      include: {
        breed: true,
        phase: true,
        farm: {
          include: {
            owner: true,
          },
        },
        weights: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        pigProduct: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        childrenFromMother: true,
        sowReproductiveCycle: {
          include: {
            reproductiveStage: true,
            birth: {
              include: {
                piglets: {
                  include: {
                    farm: {
                      include: { owner: true },
                    },
                    breed: true,
                    phase: true,
                    weights: {
                      orderBy: {
                        createdAt: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    return pigs.map((pig) => PigMapper.toDomain(pig));
  }

  async getById(id: string, farmId: string): Promise<Pig | null> {
    const pig = await this.prisma.pig.findFirst({
      where: {
        id: id,
        farmId: farmId,
        remove: false,
      },
      include: {
        breed: true,
        phase: true,
        farm: {
          include: {
            owner: true,
          },
        },
        weights: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        pigProduct: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        childrenFromMother: true,
        sowReproductiveCycle: {
          include: {
            reproductiveStage: true,
            birth: {
              include: {
                piglets: {
                  include: {
                    farm: {
                      include: { owner: true },
                    },
                    breed: true,
                    phase: true,
                    weights: {
                      orderBy: {
                        createdAt: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    if (!pig) return null;
    return PigMapper.toDomain(pig);
  }

  async getByEarTag(earTag: string, farmId: string): Promise<Pig | null> {
    const pig = await this.prisma.pig.findFirst({
      where: {
        earTag: earTag,
        farmId: farmId,
        remove: false,
      },
      include: {
        breed: true,
        phase: true,
        farm: {
          include: {
            owner: true,
          },
        },
        weights: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        pigProduct: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        childrenFromMother: true,
        sowReproductiveCycle: {
          include: {
            reproductiveStage: true,
            birth: {
              include: {
                piglets: {
                  include: {
                    farm: {
                      include: { owner: true },
                    },
                    breed: true,
                    phase: true,
                    weights: {
                      orderBy: {
                        createdAt: 'desc',
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    if (!pig) return null;
    return PigMapper.toDomain(pig);
  }
}
