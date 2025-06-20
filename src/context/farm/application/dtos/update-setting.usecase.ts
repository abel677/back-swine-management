import { Regex } from '../../../../utils/regex';

export class UpdateSettingDto {
  private constructor(
    public readonly farmId?: string,
    public readonly matingHeatDurationDays?: number,
    public readonly inseminationDurationDays?: number,
    public readonly gestationDurationDays?: number,
    public readonly lactationDurationDays?: number,
    public readonly weaningDurationDays?: number,
    public readonly restingDurationDays?: number,
    public readonly initialPigletPrice?: number,
    public readonly minimumBreedingAgeInDays?: number,
  ) {}
  static create(body: { [key: string]: any }): [string?, UpdateSettingDto?] {
    const farmId = body?.farmId;
    const matingHeatDurationDays = body?.matingHeatDurationDays;
    const inseminationDurationDays = body?.inseminationDurationDays;
    const gestationDurationDays = body?.gestationDurationDays;
    const lactationDurationDays = body?.lactationDurationDays;
    const weaningDurationDays = body?.weaningDurationDays;
    const restingDurationDays = body?.restingDurationDays;
    const initialPigletPrice = body?.initialPigletPrice;
    const minimumBreedingAgeInDays = body?.minimumBreedingAgeInDays;

    if (farmId && !Regex.isValidUUID(farmId)) {
      return ['farmId: ID de granja inválido o faltante.'];
    }
    if (matingHeatDurationDays && typeof matingHeatDurationDays !== 'number') {
      return ['matingHeatDurationDays: Inválido o faltante.'];
    }
    if (
      inseminationDurationDays &&
      typeof inseminationDurationDays !== 'number'
    ) {
      return ['inseminationDurationDays: Inválido o faltante.'];
    }
    if (gestationDurationDays && typeof gestationDurationDays !== 'number') {
      return ['gestationDurationDays: Inválido o faltante.'];
    }
    if (lactationDurationDays && typeof lactationDurationDays !== 'number') {
      return ['lactationDurationDays: Inválido o faltante.'];
    }
    if (weaningDurationDays && typeof weaningDurationDays !== 'number') {
      return ['weaningDurationDays: Inválido o faltante.'];
    }
    if (restingDurationDays && typeof restingDurationDays !== 'number') {
      return ['restingDurationDays: Inválido o faltante.'];
    }
    if (initialPigletPrice && typeof initialPigletPrice !== 'number') {
      return ['initialPigletPrice: Inválido o faltante.'];
    }
    if (
      minimumBreedingAgeInDays &&
      typeof minimumBreedingAgeInDays !== 'number'
    ) {
      return ['minimumBreedingAgeInDays: Inválido o faltante.'];
    }

    return [
      undefined,
      new UpdateSettingDto(
        farmId,
        matingHeatDurationDays,
        inseminationDurationDays,
        gestationDurationDays,
        lactationDurationDays,
        weaningDurationDays,
        restingDurationDays,
        initialPigletPrice,
        minimumBreedingAgeInDays,
      ),
    ];
  }
}
