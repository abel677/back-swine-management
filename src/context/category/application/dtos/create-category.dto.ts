import { Regex } from '../../../../utils/regex';

export class CreateCategoryDto {
  private constructor(
    public farmId: string,
    public name: string,
  ) {}

  static create(body: { [key: string]: any }): [string?, CreateCategoryDto?] {
    if (!Regex.isValidUUID(body?.farmId)) {
      return ['farmId: ID de granja inválido o faltante.'];
    }
    if (!body?.name) {
      return ['name: Nombre faltante.'];
    }
    return [undefined, new CreateCategoryDto(body.farmId, body.name)];
  }
}
