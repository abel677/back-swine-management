import { Regex } from '../../../../utils/regex';

export class SignUpDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
  ) {}

  static create(body: { [key: string]: any }): [string?, SignUpDto?] {
    const email = body?.email;
    const name = body?.name || email;
    const password = body?.password;

    if (!email || !Regex.email().test(email)) {
      return ['email: Ingresar email.'];
    }

    if (!password) {
      return ['password: Ingresar contraseña.'];
    }

    return [undefined, new SignUpDto(name, email, password)];
  }
}
