export class CreateDeviceDto {
  private constructor(
    public token: string,
    public platform: string,
  ) {}

  static create(body: { [key: string]: any }): [string?, CreateDeviceDto?] {
    if (!body?.token) {
      return ['token: Token is missing.'];
    }
    if (!body?.platform) {
      return ['platform: Platform is missing.'];
    }
    return [undefined, new CreateDeviceDto(body.token, body.platform)];
  }
}
