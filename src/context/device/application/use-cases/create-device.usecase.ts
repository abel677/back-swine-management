import { inject, injectable } from 'tsyringe';
import { Device } from '../../domain/entities/device.entity';
import { DeviceRepository } from '../../domain/ports/device.repository';
import { CreateDeviceDto } from '../dtos/create-device.dto';

@injectable()
export class CreateDeviceUseCase {
  constructor(
    @inject('DeviceRepository')
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async execute(userId: string, dto: CreateDeviceDto): Promise<Device> {
    const device = Device.create({
      userId: userId,
      platform: dto.platform,
      token: dto.token,
    });
    await this.deviceRepository.create(device);
    return device;
  }
}
