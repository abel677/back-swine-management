import { Regex } from '../../../../utils/regex';

export class UpdateCategoryDto {
  private constructor(
    public farmId: string,
    public name: string,
  ) {}

  static create(body: { [key: string]: any }): [string?, UpdateCategoryDto?] {
    if (!Regex.isValidUUID(body?.farmId)) {
      return ['farmId: ID de granja inválido o faltante.'];
    }
    if (!body?.name) {
      return ['name: Nombre faltante.'];
    }
    return [undefined, new UpdateCategoryDto(body.farmId, body.name)];
  }
}
