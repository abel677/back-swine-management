import { Regex } from '../../../../utils/regex';

export class UpdateProductDto {
  private constructor(
    public farmId?: string,
    public categoryId?: string,
    public name?: string,
    public price?: number,
    public description?: string,
  ) {}

  static create(body: { [key: string]: any }): [string?, UpdateProductDto?] {
    if (body.farmId !== undefined) {
      if (!Regex.isValidUUID(body.farmId)) {
        return ['farmId: ID de granja inválido o faltante.'];
      }
    }
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length === 0) {
        return ['name: Nombre de producto inválido.'];
      }
    }

    if (body.price !== undefined) {
      if (typeof body.price !== 'number' || body.price < 0) {
        return [
          'price: Precio de producto debe ser un número mayor o igual a cero.',
        ];
      }
    }

    if (body.description !== undefined) {
      if (typeof body.description !== 'string') {
        return ['description: La descripción debe ser un texto.'];
      }
    }

    if (body.categoryId !== undefined) {
      if (!Regex.isValidUUID(body.categoryId)) {
        return ['categoryId: ID de categoría inválido o faltante.'];
      }
    }

    return [
      undefined,
      new UpdateProductDto(
        body.farmId,
        body.categoryId,
        body.name?.trim(),
        body.price,
        body.description?.trim(),
      ),
    ];
  }
}
