import { Regex } from '../../../../utils/regex';

export class CreateNotificationDto {
  private constructor(
    public readonly title: string,
    public readonly message: string,
    public readonly createdAt: Date,
    public readonly eventType: string,
  ) {}

  static create(body: {
    [key: string]: any;
  }): [string?, CreateNotificationDto?] {
    if (!body.title) {
      return ['title: Título faltante.'];
    }
    if (!body.message) {
      return ['message: Mensaje faltante.'];
    }
    if (!body.createdAt || !Regex.isoDate.test(body.createdAt)) {
      return ['createdAt: Fecha evento faltante.'];
    }
    if (!body.eventType) {
      return ['eventType: Tipo notificación faltante.'];
    }

    return [
      undefined,
      new CreateNotificationDto(
        body.title,
        body.message,
        new Date(body.createdAt),
        body.eventType,
      ),
    ];
  }
}
