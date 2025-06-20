import { Device } from "../entities/device.entity";

export interface DeviceRepository {
  create(device: Device): Promise<Device>;
  getAll(userId: string): Promise<Device[]>;
  findByToken(token: string): Promise<Device | null>;
}
