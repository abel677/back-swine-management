import { PrismaClient } from '@prisma/client';
import { SettingRepository } from '../../../domain/ports/setting.repository';
import { Setting } from '../../../domain/entities/setting.entity';
import { SettingMapper } from '../../mappers/setting.mapper';
import { inject, injectable } from 'tsyringe';

@injectable()
export class PrismaSettingRepository implements SettingRepository {
  constructor(@inject('PrismaClient') private readonly prisma: PrismaClient) {}

  async update(setting: Setting): Promise<void> {
    await this.prisma.setting.update({
      where: { id: setting.id },
      data: SettingMapper.toUpdatePersistence(setting),
    });
  }
  async create(setting: Setting): Promise<void> {
    await this.prisma.setting.create({
      data: SettingMapper.toCreatePersistence(setting),
    });
  }

  async getByFarmId(farmId: string): Promise<Setting | null> {
    const data = await this.prisma.setting.findFirst({
      where: { farmId },
    });

    if (!data) return null;
    return SettingMapper.toDomain(data);
  }

  async all(userId: string): Promise<Setting[]> {
    const settings = await this.prisma.setting.findMany({
      where: {
        farm: {
          OR: [
            {
              ownerId: userId,
            },
            {
              workers: { some: { userId } },
            },
          ],
        },
      },
    });
    return settings.map((setting) => SettingMapper.toDomain(setting));
  }

  async getByUserId(userId: string): Promise<Setting | null> {
    const data = await this.prisma.setting.findFirst({
      where: {
        farm: {
          OR: [
            {
              ownerId: userId,
            },
            {
              workers: { some: { userId } },
            },
          ],
        },
      },
    });
    if (!data) return null;
    return SettingMapper.toDomain(data);
  }
}
