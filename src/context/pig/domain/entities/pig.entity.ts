import { PigPhase, PigState, PigType } from '../../../../utils/pig.enum';
import { Util } from '../../../../utils/utils';
import { Breed } from '../../../breed/domain/breed.entity';
import { Farm } from '../../../farm/domain/entities/farm.entity';
import { Phase } from '../../../farm/domain/entities/phase.entity';
import { PigProduct } from './pig-product.entity';
import { PigWeight } from './pig-weight';
import { ReproductiveCycle } from './reproductive-cycle.entity';

export type Gender = 'Macho' | 'Hembra';
export type Type = 'Producción' | 'Reproducción';

interface PigProps {
  farm: Farm;
  breed: Breed;
  gender: Gender;
  phase: Phase;

  type: Type;
  earTag: string;
  birthDate: Date;
  initialPrice: number;
  investedPrice: number;
  state: PigState;
  weaned?: boolean;
  birthId?: string;
  motherId?: string;
  fatherId?: string;

  corralId?: string;
  sowReproductiveCycle: ReproductiveCycle[];
  sowCurrentReproductiveCycle: ReproductiveCycle | null;
  weights: PigWeight[];
  pigProduct: PigProduct[];

  //childrenFromMother: Pig[];

  createdAt: Date;
  updatedAt: Date;
}

type CreatePig = Omit<
  PigProps,
  //| 'childrenFromMother'
  //| 'childrenFromFather'
  | 'sowReproductiveCycle'
  | 'investedPrice'
  | 'state'
  | 'sowCurrentReproductiveCycle'
  | 'weights'
  | 'pigProduct'
  | 'createdAt'
  | 'updatedAt'
>;

export class Pig {
  private constructor(
    public readonly id: string,
    private props: PigProps,
  ) {}

  static create(props: CreatePig): Pig {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new Pig(id, {
      ...props,
      state: PigState.Alive,
      investedPrice: 0,
      sowReproductiveCycle: [],
      weights: [],
      pigProduct: [],
      sowCurrentReproductiveCycle: null,
      //childrenFromMother: [],
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  }

  static toDomain(data: { id: string } & PigProps): Pig {
    return new Pig(data.id, data);
  }

  isSow() {
    return this.gender === 'Hembra' && this.type === 'Reproducción';
  }
  isBoar() {
    return this.gender === 'Macho' && this.type === 'Reproducción';
  }
  boarCanReproduce() {
    if (!this.isBoar()) return false;
    const disallowedPhases: PigPhase[] = [
      PigPhase.Neonatal,
      PigPhase.Weaning,
      PigPhase.Starter,
    ];
    return !disallowedPhases.includes(this.phase.name as PigPhase);
  }

  getAge(): number {
    const now = new Date();
    const birth = new Date(this.props.birthDate);
    const diffMs = now.getTime() - birth.getTime();
    const ageInDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return ageInDays;
  }

  private updateTimestamp() {
    this.props.updatedAt = Util.now();
  }

  saveWeight(pigWeight: PigWeight) {
    const index = this.props.weights.findIndex((w) => w.id === pigWeight.id);
    if (index !== -1) {
      this.props.weights[index] = pigWeight;
      this.props.updatedAt = Util.now();
    } else {
      this.props.weights.unshift(pigWeight);
    }
  }

  savePigProduct(pigProduct: PigProduct, previousPrice?: number) {
    const index = this.props.pigProduct.findIndex(
      (p) => p.id === pigProduct.id,
    );

    if (index !== -1) {
      const oldPrice = previousPrice ?? this.props.pigProduct[index].price;
      const oldQuantity = this.props.pigProduct[index].quantity;
      this.props.investedPrice +=
        pigProduct.price * pigProduct.quantity - oldPrice * oldQuantity;

      this.props.pigProduct[index] = pigProduct;
    } else {
      this.props.investedPrice += pigProduct.price * pigProduct.quantity;
      this.props.pigProduct.unshift(pigProduct);
    }

    this.updateTimestamp();
  }

  saveSowReproductiveCycle(cycle: ReproductiveCycle) {
    const index = this.sowReproductiveCycle.findIndex((c) => c.id === cycle.id);
    if (index === -1) {
      this.sowReproductiveCycle.unshift(cycle);
      this.props.sowCurrentReproductiveCycle = cycle;
    } else {
      this.sowReproductiveCycle[index] = cycle;
    }
  }

  saveWeaned(weaned: boolean) {
    this.props.weaned = weaned;
  }
  saveState(state: PigState) {
    this.props.state = state;
  }
  saveInitialPrice(initialPrice: number) {
    this.props.initialPrice = initialPrice;
  }
  saveBirthDate(birthDate: Date) {
    this.props.birthDate = birthDate;
  }
  saveEarTag(earTag: string) {
    this.props.earTag = earTag;
  }
  saveType(type: PigType) {
    this.props.type = type;
  }

  savePhase(phase: Phase) {
    this.props.phase = phase;
  }

  saveBreed(newBreed: Breed) {
    this.props.breed = newBreed;
  }
  saveFarm(farm: Farm) {
    this.props.farm = farm;
  }

  get earTag() {
    return this.props.earTag;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get gender() {
    return this.props.gender;
  }

  get state() {
    return this.props.state;
  }

  get initialPrice() {
    return this.props.initialPrice;
  }

  get investedPrice() {
    return this.props.investedPrice;
  }

  get type() {
    return this.props.type;
  }

  get breed() {
    return this.props.breed;
  }
  get phase() {
    return this.props.phase;
  }
  get farm() {
    return this.props.farm;
  }

  get weaned() {
    return this.props.weaned;
  }

  get birthId() {
    return this.props.birthId;
  }

  get motherId() {
    return this.props.motherId;
  }

  get fatherId() {
    return this.props.fatherId;
  }

  get corralId() {
    return this.props.corralId;
  }

  get pigProduct() {
    return this.props.pigProduct;
  }

  get sowReproductiveCycle() {
    return this.props.sowReproductiveCycle;
  }
  get sowCurrentReproductiveCycle() {
    return this.props.sowCurrentReproductiveCycle;
  }

  // get childrenFromMother() {
  //   return this.props.childrenFromMother;
  // }
  get weights() {
    return this.props.weights;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
