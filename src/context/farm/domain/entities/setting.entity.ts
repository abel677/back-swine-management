import { Farm } from './farm.entity';

export interface SettingProps {
  farmId: string;
  matingHeatDurationDays: number;
  inseminationDurationDays: number;
  gestationDurationDays: number;
  lactationDurationDays: number;
  weaningDurationDays: number;
  restingDurationDays: number;
  initialPigletPrice: number;
  minimumBreedingAgeInDays: number;
}

export interface SettingCreateProps
  extends Omit<SettingProps, 'createdAt' | 'updatedAt'> {}

export class Setting {
  private constructor(
    public readonly id: string,
    private readonly props: SettingProps,
  ) {}

  static create(props: SettingCreateProps): Setting {
    return new Setting(crypto.randomUUID(), {
      ...props,
    });
  }

  static fromPrimitives(data: { id: string } & SettingProps) {
    return new Setting(data.id, data);
  }

  saveMinimumBreedingAgeInDays(minimumBreedingAgeInDays: number) {
    this.props.minimumBreedingAgeInDays = minimumBreedingAgeInDays;
  }

  saveInitialPigletPrice(initialPigletPrice: number) {
    this.props.initialPigletPrice = initialPigletPrice;
  }

  saveRestingDurationDays(restingDurationDays: number) {
    this.props.restingDurationDays = restingDurationDays;
  }

  saveWeaningDurationDays(weaningDurationDays: number) {
    this.props.weaningDurationDays = weaningDurationDays;
  }

  saveLactationDurationDays(lactationDurationDays: number) {
    this.props.lactationDurationDays = lactationDurationDays;
  }

  saveGestationDurationDays(gestationDurationDays: number) {
    this.props.gestationDurationDays = gestationDurationDays;
  }

  saveInseminationDurationDays(inseminationDurationDays: number) {
    this.props.inseminationDurationDays = inseminationDurationDays;
  }

  saveMatingHeatDurationDays(matingHeatDurationDays: number) {
    this.props.matingHeatDurationDays = matingHeatDurationDays;
  }

  saveFarm(farm: Farm) {
    this.props.farmId = farm.id;
  }

  get farmId() {
    return this.props.farmId;
  }

  get matingHeatDurationDays() {
    return this.props.matingHeatDurationDays;
  }

  get inseminationDurationDays() {
    return this.props.inseminationDurationDays;
  }

  get gestationDurationDays() {
    return this.props.gestationDurationDays;
  }

  get lactationDurationDays() {
    return this.props.lactationDurationDays;
  }

  get weaningDurationDays() {
    return this.props.weaningDurationDays;
  }

  get restingDurationDays() {
    return this.props.restingDurationDays;
  }
  get initialPigletPrice() {
    return this.props.initialPigletPrice;
  }
  get minimumBreedingAgeInDays() {
    return this.props.minimumBreedingAgeInDays;
  }
}
