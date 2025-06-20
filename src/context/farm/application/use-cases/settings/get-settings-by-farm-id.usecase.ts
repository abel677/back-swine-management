import { inject, injectable } from 'tsyringe';
import { SettingRepository } from '../../../domain/ports/setting.repository';
import { Setting } from '../../../domain/entities/setting.entity';

@injectable()
export class GetSettingByFarmIdUseCase {
  constructor(
    @inject('SettingRepository')
    private readonly settingRepository: SettingRepository,
  ) {}

  async execute(farmId: string): Promise<Setting | null> {
    return await this.settingRepository.getByFarmId(farmId);
  }
}
