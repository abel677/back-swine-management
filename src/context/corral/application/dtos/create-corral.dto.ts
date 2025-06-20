import { Regex } from '../../../../utils/regex';

export class CreateCorralDto {
  private constructor(
    public farmId: string,
    public name: string,
    public pigs?: { id: string }[],
  ) {}

  static create(body: { [key: string]: any }): [string?, CreateCorralDto?] {
    if (!Regex.isValidUUID(body?.farmId)) {
      return ['farmId: ID de granja inválido o faltante.'];
    }

    if (typeof body?.name !== 'string' || body.name.trim() === '') {
      return ['name: Nombre de corral inválido o faltante.'];
    }

    if (body?.pigs && body?.pigs !== undefined) {
      if (!Array.isArray(body.pigs)) {
        return ['pigs: Debe ser una lista válida.'];
      }

      for (const pig of body.pigs) {
        if (!Regex.isValidUUID(pig?.id)) {
          return ['pigs: Todos los cerdos deben tener un ID válido.'];
        }
      }
    }

    return [undefined, new CreateCorralDto(body.farmId, body.name, body.pigs)];
  }
}
