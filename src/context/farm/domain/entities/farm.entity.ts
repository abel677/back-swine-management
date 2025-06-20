import { Application } from '../../../../utils/http-error';
import { Util } from '../../../../utils/utils';
import { User } from '../../../user/domain/entities/user.entity';

interface FarmProps {
  name: string;
  owner: User;
  createdAt: Date;
  updatedAt: Date;
}

type createFarm = Omit<FarmProps, 'createdAt' | 'updatedAt'>;

export class Farm {
  private constructor(
    public readonly id: string,
    private readonly pros: FarmProps,
  ) {}

  static create(farm: createFarm) {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new Farm(id, {
      ...farm,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }
  static toDomain(data: { id: string } & FarmProps) {
    try {
      return new Farm(data.id, data);
    } catch (error) {
      throw Application.internal(
        'Error al mapear los datos en modelo de granja.',
      );
    }
  }

  get createdAt() {
    return this.pros.createdAt;
  }
  get updatedAt() {
    return this.pros.updatedAt;
  }
  get owner() {
    return this.pros.owner;
  }
  get name() {
    return this.pros.name;
  }
}
