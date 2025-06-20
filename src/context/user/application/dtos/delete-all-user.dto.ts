import { Regex } from '../../../../utils/regex';

export class DeleteManyUserDto {
  private constructor(
    public readonly users: {
      id: string;
    }[],
  ) {}

  static create(body: { [key: string]: any }): [string?, DeleteManyUserDto?] {
    const users = body?.users;

    // validar users
    if (!users) {
      return ['users: Usuarios requerido.'];
    }

    if (!Array.isArray(users)) {
      return ['users: Debe ser un array con objetos { id }.'];
    }

    for (const [index, rol] of users.entries()) {
      if (!rol || typeof rol !== 'object' || !('id' in rol)) {
        return [
          `users[${index}]: Objeto inválido, debe contener la propiedad "id".`,
        ];
      }

      if (!Regex.isValidUUID(rol.id)) {
        return [`users[${index}].id: ID del rol inválido.`];
      }
    }

    return [undefined, new DeleteManyUserDto(users)];
  }
}
