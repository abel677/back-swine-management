import { Util } from '../../../../utils/utils';

interface PhaseProps {
  farmId: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
type CreatePhase = Omit<PhaseProps, 'createdAt' | 'updatedAt'>;
export class Phase {
  private constructor(
    public readonly id: string,
    private readonly props: PhaseProps,
  ) {}

  static create(props: CreatePhase) {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new Phase(id, {
      ...props,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  static fromPrimitives(data: { id: string } & PhaseProps) {
    return new Phase(data.id, data);
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get order() {
    return this.props.order;
  }
  get name() {
    return this.props.name;
  }
  get farmId() {
    return this.props.farmId;
  }
}
