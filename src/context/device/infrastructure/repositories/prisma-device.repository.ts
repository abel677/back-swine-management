import { PrismaClient } from '@prisma/client';
import { Device } from '../../domain/entities/device.entity';
import { DeviceRepository } from '../../domain/ports/device.repository';
import { DeviceMapper } from '../mappers/device.mapper';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaDeviceRepository implements DeviceRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async create(device: Device): Promise<Device> {
    const data = DeviceMapper.toPersistence(device);

    const newDevice = await this.prisma.device.upsert({
      where: { token: data.token },
      update: {
        userId: data.userId,
        platform: data.platform,
      },
      create: data,
    });

    return DeviceMapper.toDomain(newDevice);
  }

  async getAll(userId: string): Promise<Device[]> {
    const devices = await this.prisma.device.findMany({
      where: { userId },
    });
    return devices.map((device) => DeviceMapper.toDomain(device));
  }

  async findByToken(token: string): Promise<Device | null> {
    const device = await this.prisma.device.findUnique({
      where: {
        token: token,
      },
    });

    if (!device) return null;
    return device ? DeviceMapper.toDomain(device) : null;
  }
}
