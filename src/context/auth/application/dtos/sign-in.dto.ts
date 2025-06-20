import { Regex } from '../../../../utils/regex';

export class SignInDto {
  private constructor(
    public readonly email: string,
    public readonly name?: string,
    public readonly provider?: string,
    public readonly password?: string,
  ) {}

  static create(body: { [key: string]: any }): [string?, SignInDto?] {
    const email = body?.email;
    const name = body?.name;
    const provider = body?.provider;
    const password = body?.password;

    if (!email || !Regex.email().test(email)) {
      return ['email: Ingresar email.'];
    }

    // si no se envía un provider, es obligatoria la contraseña
    if (!provider) {
      if (!password) {
        return ['password: Ingresar contraseña.'];
      }
    }
    return [undefined, new SignInDto(email, name, provider, password)];
  }
}
