import { Rol } from '../entities/rol.entity';

export interface RolRepository {
  all(): Promise<Rol[]>;
  getByNames(names: { name: string }[]): Promise<Rol[]>;
  getByIds(ids: { id: string }[]): Promise<Rol[]>;
}
