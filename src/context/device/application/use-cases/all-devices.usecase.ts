import { inject, injectable } from 'tsyringe';
import { Device } from '../../domain/entities/device.entity';
import { DeviceRepository } from '../../domain/ports/device.repository';

@injectable()
export class AllDevicesUseCase {
  constructor(
    @inject('DeviceRepository')
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async execute(userId: string): Promise<Device[]> {
    return this.deviceRepository.getAll(userId);
  }
}
