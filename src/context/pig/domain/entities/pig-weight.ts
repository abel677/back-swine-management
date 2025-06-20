import { Util } from '../../../../utils/utils';

interface PigWightProps {
  pigId: string;
  days: number;
  weight: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePigWeight = Omit<PigWightProps, 'createdAt' | 'updatedAt'>;

export class PigWeight {
  private constructor(
    public readonly id: string,
    private readonly props: PigWightProps,
  ) {}

  static create(props: CreatePigWeight) {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new PigWeight(id, {
      ...props,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  static fromPrimitives(data: { id: string } & PigWightProps): PigWeight {
    return new PigWeight(data.id, {
      ...data,
    });
  }

  private updateTimeStamps() {
    this.props.updatedAt = Util.now();
  }

  saveWeight(weight: number) {
    this.props.weight = weight;
    this.updateTimeStamps();
  }
  saveDays(days: number) {
    this.props.days = days;
    this.updateTimeStamps();
  }

  get pigId() {
    return this.props.pigId;
  }

  get days() {
    return this.props.days;
  }

  get weight() {
    return this.props.weight;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}
