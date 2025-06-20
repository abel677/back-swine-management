import { Util } from '../../../../utils/utils';
import { Phase } from '../../../farm/domain/entities/phase.entity';
import { Pig } from './pig.entity';

interface BirthProps {
  numberBirth: number;
  cycleId: string;
  date: Date;
  liveMales: number;
  liveFemales: number;
  totalDead: number;
  avgWeight: number;
  description?: string;
  weanedAt?: Date;
  piglets: Pig[];
}

type CreateBirth = Omit<BirthProps, 'piglets' | 'numberBirth'>;

export class Birth {
  private constructor(
    public readonly id: string,
    private props: BirthProps,
  ) {}

  static create(props: CreateBirth): Birth {
    const id = crypto.randomUUID();
    return new Birth(id, { ...props, piglets: [], numberBirth: 1 });
  }

  static toDomain(data: { id: string } & BirthProps): Birth {
    return new Birth(data.id, data);
  }

  weanLitter(phaseStarter: Phase): void {
    this.props.weanedAt = Util.now();
    this.props.piglets.forEach((piglet) => {
      piglet.savePhase(phaseStarter);
      piglet.saveWeaned(true);
    });
  }

  saveNumberBirth(numberBirth: number) {
    this.props.numberBirth = numberBirth;
  }

  get cycleId() {
    return this.props.cycleId;
  }

  get date() {
    return this.props.date;
  }

  get numberBirth() {
    return this.props.numberBirth;
  }

  get liveMales() {
    return this.props.liveMales;
  }

  get liveFemales() {
    return this.props.liveFemales;
  }

  get totalDead() {
    return this.props.totalDead;
  }

  get avgWeight() {
    return this.props.avgWeight;
  }

  get description() {
    return this.props.description;
  }

  get weanedAt() {
    return this.props.weanedAt;
  }

  get piglets() {
    return this.props.piglets;
  }

  savePiglet(piglet: Pig): void {
    const exists = this.props.piglets.some((p) => p.id === piglet.id);

    this.props.piglets = exists
      ? this.props.piglets.map((p) => (p.id === piglet.id ? piglet : p))
      : [piglet, ...this.props.piglets];
  }
}
