import { Regex } from '../../../../utils/regex';

export class UpdateUserDto {
  private constructor(
    public readonly name?: string,
    public readonly email?: string,
    public readonly password?: string,
    public readonly roles?: {
      id: string;
    }[],
  ) {}

  static create(body: { [key: string]: any }): [string?, UpdateUserDto?] {
    const name = body?.name;
    const email = body?.email;
    const password = body?.password;
    const roles = body?.roles;

    // Validar email si se proporciona
    if (email !== undefined && !Regex.email().test(email)) {
      return ['email: Correo electrónico inválido.'];
    }

    // Validar password si se proporciona
    if (password !== undefined && !Regex.password().test(password)) {
      return [
        'password: La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.',
      ];
    }

    // Validar roles si se proporciona
    if (roles !== undefined) {
      if (!Array.isArray(roles)) {
        return ['roles: Debe ser un array con objetos { id }.'];
      }

      for (const [index, rol] of roles.entries()) {
        if (!rol || typeof rol !== 'object' || !('id' in rol)) {
          return [
            `roles[${index}]: Objeto inválido, debe contener la propiedad "id".`,
          ];
        }

        if (!Regex.isValidUUID(rol.id)) {
          return [`roles[${index}].id: ID del rol inválido.`];
        }
      }
    }

    return [undefined, new UpdateUserDto(name, email, password, roles)];
  }
}
