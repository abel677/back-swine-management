import { Util } from '../../../../utils/utils';
import { Farm } from '../../../farm/domain/entities/farm.entity';

interface CorralProps {
  name: string;
  farm: Farm;
  pigs: { id: string }[];
  createdAt: Date;
  updatedAt: Date;
}

type CreateCorral = Omit<CorralProps, 'createdAt' | 'updatedAt'>;

export class Corral {
  private constructor(
    public readonly id: string,
    private props: CorralProps,
  ) {}

  static create(props: CreateCorral) {
    const currentDate = Util.now();
    return new Corral(crypto.randomUUID(), {
      ...props,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }
  static toDomain(data: { id: string } & CorralProps) {
    return new Corral(data.id, data);
  }

  saveFarm(farm: Farm) {
    this.props.farm = farm;
  }

  saveName(name: string) {
    this.props.name = name;
  }

  savePigs(pigs: { id: string }[]) {
    this.props.pigs = pigs;
  }

  get farm() {
    return this.props.farm;
  }

  get name() {
    return this.props.name;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }

  get pigs() {
    return this.props.pigs;
  }
}
