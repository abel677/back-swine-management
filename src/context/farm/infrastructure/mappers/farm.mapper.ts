import { User } from '../../../user/domain/entities/user.entity';
import { Farm } from '../../domain/entities/farm.entity';

export class FarmMapper {
  static toHttpResponse(farm: Farm) {
    return {
      id: farm.id,
      name: farm.name,
      owner: {
        id: farm.owner.id,
      },
      createdAt: farm.createdAt,
      updatedAt: farm.updatedAt,
    };
  }
  static toDomain(farm: any): Farm {
    return Farm.toDomain({
      id: farm.id,
      name: farm.name,
      owner: User.toDomain(farm.owner),
      createdAt: farm.createdAt,
      updatedAt: farm.updatedAt,
    });
  }
}
