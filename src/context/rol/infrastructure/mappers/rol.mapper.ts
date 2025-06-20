import { Rol } from '../../domain/entities/rol.entity';

export class RolMapper {
  static toHttpResponse(rol: Rol) {
    return {
      id: rol.id,
      name: rol.name,
    };
  }
}
