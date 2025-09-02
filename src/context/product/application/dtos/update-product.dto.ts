import { Regex } from '../../../../utils/regex';

export class UpdateProductDto {
  private constructor(
    public category?: {
      id?: string;
      name?: string;
    },
    public farmId?: string,
    public name?: string,
    public price?: number,
    public unitMeasurement?: string,
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

    if (body.unitMeasurement !== undefined) {
      if (
        typeof body.unitMeasurement !== 'string' ||
        body.unitMeasurement.trim().length === 0
      ) {
        return ['unitMeasurement: Unidad de medida faltante o inválido.'];
      }
    }

    if (body.description !== undefined) {
      if (typeof body.description !== 'string') {
        return ['description: La descripción debe ser un texto.'];
      }
    }

    if (body?.category && typeof body.category !== 'object') {
      return ['category: La categoría es obligatoria y debe ser un objeto.'];
    }

    if (
      body.category.id &&
      body.category.id !== null &&
      !Regex.isValidUUID(body.category.id)
    ) {
      return ['category.id: ID de categoría inválido.'];
    }

    if (
      typeof body.category.name !== 'string' ||
      body.category.name.trim().length === 0
    ) {
      return ['category.name: Nombre de categoría inválido o faltante.'];
    }

    return [
      undefined,
      new UpdateProductDto(
        body.farmId,
        body.categoryId,
        body.name?.trim(),
        body.price,
        body.unitMeasurement?.trim(),
        body.description?.trim(),
      ),
    ];
  }
}
