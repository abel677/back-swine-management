import { Regex } from '../../../../utils/regex';

export class CreateBreedDto {
  private constructor(
    public farmId: string,
    public name: string,
  ) {}

  static create(body: { [key: string]: any }): [string?, CreateBreedDto?] {
    if (!Regex.isValidUUID(body?.farmId)) {
      return ['farmId: ID de granja inválido o faltante.'];
    }
    if (!body?.name) {
      return ['name: Nombre de raza faltante.'];
    }
    return [undefined, new CreateBreedDto(body.farmId, body.name)];
  }
}
