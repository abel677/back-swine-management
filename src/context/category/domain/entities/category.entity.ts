import { Util } from '../../../../utils/utils';
import { Farm } from '../../../farm/domain/entities/farm.entity';

interface CategoryProps {
  farmId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

type CreateCategory = Omit<CategoryProps, 'createdAt' | 'updatedAt'>;

export class Category {
  private constructor(
    public readonly id: string,
    public readonly props: CategoryProps,
  ) {}

  static create(props: CreateCategory) {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new Category(id, {
      ...props,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  static mapToDomain(data: { id: string } & CategoryProps) {
    return new Category(data.id, data);
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
