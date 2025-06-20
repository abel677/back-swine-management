import { Corral } from '../entities/corral.entity';

export interface CorralRepository {
  all(userId: string): Promise<Corral[]>;
  save(corral: Corral): Promise<void>;
  getByName(name: string, userId: string): Promise<Corral | null>;
  getById(id: string, userId: string): Promise<Corral | null>;
}
