import { ReproductiveStage } from '../../../farm/domain/entities/reproductive-stage.entity';
import { Birth } from './birth.entity';

interface ReproductiveCycleProps {
  sowId: string;
  startDate: Date;
  endDate: Date;
  reproductiveStage: ReproductiveStage;
  birth?: Birth;
  boarId?: string;
}

type CreateReproductiveCycle = Omit<ReproductiveCycleProps, ''>;

export class ReproductiveCycle {
  private constructor(
    public readonly id: string,
    private props: ReproductiveCycleProps,
  ) {}

  static create(props: CreateReproductiveCycle): ReproductiveCycle {
    const id = crypto.randomUUID();
    return new ReproductiveCycle(id, props);
  }

  static toDomain(
    data: { id: string } & ReproductiveCycleProps,
  ): ReproductiveCycle {
    return new ReproductiveCycle(data.id, data);
  }

  saveBirth(birth: Birth) {
    this.props.birth = birth;
  }

  get boarId() {
    return this.props.boarId;
  }
  get sowId() {
    return this.props.sowId;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get reproductiveStage() {
    return this.props.reproductiveStage;
  }

  get birth() {
    return this.props.birth;
  }
}
