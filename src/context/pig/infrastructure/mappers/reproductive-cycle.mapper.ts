import { ReproductiveStageMapper } from '../../../farm/infrastructure/mappers/reproductive-state.mapper';
import { Birth } from '../../domain/entities/birth.entity';
import { ReproductiveCycle } from '../../domain/entities/reproductive-cycle.entity';
import { BirthMapper } from './birth.mapper';

export class ReproductiveCycleMapper {
  static toHttpResponse(reproductiveCycle: ReproductiveCycle) {
    return {
      id: reproductiveCycle.id,
      sowId: reproductiveCycle.sowId,
      startDate: reproductiveCycle.startDate,
      endDate: reproductiveCycle.endDate,
      reproductiveStage: ReproductiveStageMapper.toHttpResponse(
        reproductiveCycle.reproductiveStage,
      ),
      boarId: reproductiveCycle.boarId || null,
      birth: reproductiveCycle.birth
        ? BirthMapper.toHttpResponse(reproductiveCycle.birth)
        : null,
    };
  }
  static toDomain(data: any) {
    return ReproductiveCycle.toDomain({
      id: data.id,
      sowId: data.sowId,
      boarId: data.boarId,
      startDate: data.startDate,
      endDate: data.endDate,
      reproductiveStage: ReproductiveStageMapper.toDomain(
        data.reproductiveStage,
      ),
      birth: data.birth ? BirthMapper.toDomain(data.birth) : undefined,
    });
  }
}
