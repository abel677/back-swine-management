import { Regex } from '../../../../utils/regex';

interface UpdateBreedBody {
  farmId?: string;
  name?: string;
}

export class UpdateBreedDto {
  private constructor(
    public readonly farmId?: string,
    public readonly name?: string,
  ) {}

  static create(body: UpdateBreedBody): [string?, UpdateBreedDto?] {
    const errors: string[] = [];

    if (body.farmId && !Regex.isValidUUID(body.farmId)) {
      errors.push('farmId: ID de granja inválido.');
    }

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length < 2) {
        errors.push('name: Nombre de raza inválido o muy corto.');
      }
    }

    if (errors.length > 0) {
      return [errors.join(' | ')];
    }

    return [undefined, new UpdateBreedDto(body.farmId, body.name?.trim())];
  }
}
