import { inject, injectable } from 'tsyringe';
import { SettingRepository } from '../../../domain/ports/setting.repository';
import { UpdateSettingDto } from '../../dtos/update-setting.usecase';
import { GetFarmByIdUseCase } from '../get-farm-by-id.usecase';
import { Application } from '../../../../../utils/http-error';

@injectable()
export class UpdateSettingUseCase {
  constructor(
    @inject('SettingRepository')
    private readonly settingRepository: SettingRepository,
    @inject('GetFarmByIdUseCase')
    private readonly getFarmByIdUseCase: GetFarmByIdUseCase,
  ) {}

  async execute(userId: string, dto: UpdateSettingDto) {
    // todo: obtener por granja (futura actualización)
    const setting = await this.settingRepository.getByUserId(userId);
    if (!setting) throw Application.notFound('Configuración no encontrada');

    if (dto.farmId) {
      const farm = await this.getFarmByIdUseCase.execute(dto.farmId, userId);
      if (!farm) throw Application.notFound('Granja de usuario no encontrada.');
    }
    if (dto.matingHeatDurationDays) {
      setting.saveMatingHeatDurationDays(dto.matingHeatDurationDays);
    }
    if (dto.inseminationDurationDays) {
      setting.saveInseminationDurationDays(dto.inseminationDurationDays);
    }
    if (dto.gestationDurationDays) {
      setting.saveGestationDurationDays(dto.gestationDurationDays);
    }
    if (dto.lactationDurationDays) {
      setting.saveLactationDurationDays(dto.lactationDurationDays);
    }
    if (dto.weaningDurationDays) {
      setting.saveWeaningDurationDays(dto.weaningDurationDays);
    }
    if (dto.restingDurationDays) {
      setting.saveRestingDurationDays(dto.restingDurationDays);
    }
    if (dto.initialPigletPrice) {
      setting.saveInitialPigletPrice(dto.initialPigletPrice);
    }
    if (dto.minimumBreedingAgeInDays) {
      setting.saveMinimumBreedingAgeInDays(dto.minimumBreedingAgeInDays);
    }
    await this.settingRepository.update(setting);
    return setting;
  }
}
