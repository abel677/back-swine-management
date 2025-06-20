import { inject, injectable } from 'tsyringe';
import { SettingRepository } from '../../../domain/ports/setting.repository';
import { Setting } from '../../../domain/entities/setting.entity';

@injectable()
export class AllSettingUseCase {
  constructor(
    @inject('SettingRepository')
    private readonly settingRepository: SettingRepository,
  ) {}

  async execute(userId: string): Promise<Setting[]> {
    return await this.settingRepository.all(userId);
  }
}
