import { Util } from '../../../utils/utils';
import { Farm } from '../../farm/domain/entities/farm.entity';

export interface BreedProps {
  name: string;
  farmId: string;
  createdAt: Date;
  updatedAt: Date;
}

type CreateBreed = Omit<BreedProps, 'createdAt' | 'updatedAt'>;

export class Breed {
  private constructor(
    public readonly id: string,
    private props: BreedProps,
  ) {}
  static create(props: CreateBreed): Breed {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new Breed(id, {
      ...props,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  static toDomain(data: { id: string } & BreedProps): Breed {
    return new Breed(data.id, data);
  }

  saveName(name: string) {
    this.props.name = name;
    this.props.updatedAt = Util.now();
  }

  saveFarm(farm: Farm) {
    this.props.farmId = farm.id;
    this.props.updatedAt = Util.now();
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get farmId() {
    return this.props.farmId;
  }

  get name() {
    return this.props.name;
  }
}
