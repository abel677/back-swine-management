import { Regex } from '../../../../utils/regex';

export class UpdateCorralDto {
  private constructor(
    public farmId?: string,
    public name?: string,
    public pigs?: { id: string }[],
  ) {}

  static create(body: { [key: string]: any }): [string?, UpdateCorralDto?] {
    if (body?.farmId && !Regex.isValidUUID(body.farmId)) {
      return ['farmId: ID de granja inválido o faltante.'];
    }
    if (
      body?.name !== undefined &&
      (typeof body.name !== 'string' || body.name.trim() === '')
    ) {
      return ['name: Nombre del corral inválido.'];
    }

    if (body?.pigs !== undefined) {
      if (!Array.isArray(body.pigs)) {
        return ['pigs: Debe ser una lista válida.'];
      }

      for (const pig of body.pigs) {
        if (!Regex.isValidUUID(pig?.id)) {
          return ['pigs: Todos los cerdos deben tener un ID válido.'];
        }
      }
    }

    return [undefined, new UpdateCorralDto(body.farmId, body.name, body.pigs)];
  }
}
