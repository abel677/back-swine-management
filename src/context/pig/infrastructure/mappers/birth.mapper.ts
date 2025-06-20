import { Birth } from '../../domain/entities/birth.entity';
import { PigMapper } from './pig.mapper';

export class BirthMapper {
  static toHttpResponse(birth: Birth) {
    return {
      id: birth.id,
      cycleId: birth.cycleId,
      liveMales: birth.liveMales,
      liveFemales: birth.liveFemales,
      totalDead: birth.totalDead,
      avgWeight: birth.avgWeight,
      date: birth.date,
      numberBirth: birth.numberBirth,
      weanedAt: birth.weanedAt,
      description: birth.description,
      piglets: birth.piglets.map((pig) => PigMapper.toHttpResponse(pig)),
    };
  }

  static toDomain(data: any) {
    return Birth.toDomain({
      id: data.id,
      cycleId: data.cycleId,
      date: data.date,
      liveFemales: data.liveFemales,
      liveMales: data.liveMales,
      totalDead: data.totalDead,
      numberBirth: data.numberBirth,
      avgWeight: data.avgWeight,
      weanedAt: data.weanedAt,
      piglets: data.piglets.map((piglet: any) => PigMapper.toDomain(piglet)),
    });
  }
}
