import { Farm } from '../entities/farm.entity';
import { ReproductiveStage } from '../entities/reproductive-stage.entity';

export interface FarmRepository {
  createManyReproductiveStage(
    reproductiveState: ReproductiveStage[],
  ): Promise<void>;
  save(farm: Farm): Promise<void>;
  all(userId: string): Promise<Farm[]>;
  getById(id: string, userId: string): Promise<Farm | null>;
}
