import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../../domain/ports/user-repository';
import { Application } from '../../../../utils/http-error';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashService } from '../../../common/domain/ports/hash-service.port';
import { ByIdsRolUseCase } from '../../../rol/application/use-cases/by-ids-rol.usecase';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UserRepository') private readonly userRepo: UserRepository,
    @inject('HashService') private readonly hashService: HashService,
    @inject('ByIdsRolUseCase')
    private readonly ByIdsRolUseCase: ByIdsRolUseCase,
  ) {}

  async execute(user: CreateUserDto) {
    const findUser = await this.userRepo.getByEmail(user.email);
    if (findUser) {
      throw Application.badRequest('Usuario no disponible');
    }

    // Obtener roles existentes
    const roles = await this.ByIdsRolUseCase.execute(user.roles);

    // Comparar roles enviados vs encontrados
    const requestedIds = user.roles.map((r) => r.id);
    const foundIds = roles.map((r) => r.id);
    const notFoundIds = requestedIds.filter((id) => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      throw Application.badRequest(
        `Los siguientes roles no existen: ${notFoundIds.join(', ')}`,
      );
    }

    const passwordHash = await this.hashService.hash(user.password);
    const verificationToken = crypto.randomUUID();

    const newUser = User.create({
      name: user.name,
      email: user.email,
      password: passwordHash,
      verificationToken: verificationToken,
      roles: roles,
      provider: 'local',
    });

    await this.userRepo.save(newUser);
    return newUser;
  }
}
