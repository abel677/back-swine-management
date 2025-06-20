import { Device } from '../../domain/entities/device.entity';

export class DeviceMapper {
  static toHttpResponse(device: Device) {
    return {
      id: device.id,
      userId: device.userId,
      token: device.token,
      platform: device.platform,
      createdAt: device.createdAt,
    };
  }
  static toDomain(raw: any): Device {
    return Device.toDomain({
      id: raw.id,
      userId: raw.userId,
      token: raw.token,
      platform: raw.platform,
      createdAt: raw.createdAt,
    });
  }
  static toPersistence(device: Device) {
    return {
      id: device.id,
      userId: device.userId,
      token: device.token,
      platform: device.platform,
      createdAt: device.createdAt,
    };
  }
}
