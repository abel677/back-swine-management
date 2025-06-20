import { Util } from '../../../../utils/utils';

export interface DeviceProps {
  userId: string;
  token: string;
  platform: string;
  createdAt: Date;
}

type CreateDevice = Omit<DeviceProps, 'createdAt'>;

export class Device {
  private constructor(
    public readonly id: string,
    private props: DeviceProps,
  ) {}

  static create(props: CreateDevice): Device {
    const id = crypto.randomUUID();
    const currentDate = Util.now();
    return new Device(id, {
      ...props,
      createdAt: currentDate,
    });
  }

  static toDomain(data: { id: string } & DeviceProps): Device {
    return new Device(data.id, data);
  }

  get userId() {
    return this.props.userId;
  }

  get token() {
    return this.props.token;
  }

  get platform() {
    return this.props.platform;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
