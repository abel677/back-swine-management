import { Util } from '../../../../utils/utils';

interface ReproductiveStageProps {
  name: string;
  order: number;
  farmId: string;
  createdAt: Date;
  updatedAt: Date;
}

type createReproductiveStage = Omit<
  ReproductiveStageProps,
  'createdAt' | 'updatedAt'
>;

export class ReproductiveStage {
  private constructor(
    public readonly id: string,
    private readonly props: ReproductiveStageProps,
  ) {}

  static create(props: createReproductiveStage) {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new ReproductiveStage(id, {
      ...props,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  static toDomain(data: { id: string } & ReproductiveStageProps) {
    return new ReproductiveStage(data.id, data);
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
  get farmId() {
    return this.props.farmId;
  }
  get name() {
    return this.props.name;
  }
}
