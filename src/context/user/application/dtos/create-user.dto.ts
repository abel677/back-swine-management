import { Regex } from '../../../../utils/regex';

export class CreateUserDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roles: {
      id: string;
    }[],
  ) {}

  static create(body: { [key: string]: any }): [string?, CreateUserDto?] {
    const name = body?.name;
    const email = body?.email;
    const password = body?.password;
    const roles = body?.roles;

    if (!name) {
      return ['name: Nombre requerido.'];
    }
    if (!email) {
      return ['email: Correo electrónico requerido.'];
    }
    if (!Regex.email().test(email)) {
      return ['email: Correo electrónico inválido.'];
    }

    if (!Regex.password().test(password)) {
      return [
        'password: La contraseña debe tener al menos 8 caracteres, incluyendo una letra mayúscula, una letra minúscula, un número y un carácter especial.',
      ];
    }
    // validar roles
    if (!roles) {
      return ['roles: Roles del usuario requerido.'];
    }

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

    return [undefined, new CreateUserDto(name, email, password, roles)];
  }
}
